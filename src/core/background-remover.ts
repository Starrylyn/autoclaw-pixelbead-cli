/**
 * Background removal via flood-fill from image edges.
 *
 * Detects the dominant background color by sampling all four edges of the
 * image, then performs a BFS flood fill from every edge pixel whose color
 * is perceptually close (CIEDE2000) to the detected background. Matching
 * pixels are set to fully transparent (alpha = 0).
 */

import { PixelGrid } from './image-loader';
import { rgbToLab, ciede2000 } from './color-science';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Quantize a single 0-255 channel value into a reduced bucket. */
function quantize(value: number, levels: number): number {
  return Math.round((value / 255) * (levels - 1));
}

/** Build a bucket key from quantized RGB values. */
function bucketKey(r: number, g: number, b: number, levels: number): number {
  const qr = quantize(r, levels);
  const qg = quantize(g, levels);
  const qb = quantize(b, levels);
  return qr * levels * levels + qg * levels + qb;
}

/**
 * Collect all edge pixel coordinates (top row, bottom row, left column,
 * right column).  Corners are included once.
 */
function edgePixelCoords(
  width: number,
  height: number,
): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];

  // Top row
  for (let x = 0; x < width; x++) {
    coords.push({ x, y: 0 });
  }
  // Bottom row (skip if height === 1, already covered)
  if (height > 1) {
    for (let x = 0; x < width; x++) {
      coords.push({ x, y: height - 1 });
    }
  }
  // Left column (exclude corners already added)
  for (let y = 1; y < height - 1; y++) {
    coords.push({ x: 0, y });
  }
  // Right column (exclude corners already added, skip if width === 1)
  if (width > 1) {
    for (let y = 1; y < height - 1; y++) {
      coords.push({ x: width - 1, y });
    }
  }

  return coords;
}

/**
 * Read the RGBA values of a pixel from the grid's data buffer.
 */
function readPixel(
  grid: PixelGrid,
  x: number,
  y: number,
): { r: number; g: number; b: number; a: number } {
  const idx = (y * grid.width + x) * 4;
  return {
    r: grid.pixels[idx],
    g: grid.pixels[idx + 1],
    b: grid.pixels[idx + 2],
    a: grid.pixels[idx + 3],
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Detect the dominant background color by sampling all four edges of the
 * image and finding the most common quantized color bucket.
 *
 * @returns The average RGB of the most popular edge-color bucket.
 */
export function detectBackgroundColor(
  grid: PixelGrid,
): { r: number; g: number; b: number } {
  const LEVELS = 32; // quantization levels per channel
  const edges = edgePixelCoords(grid.width, grid.height);

  // Map from bucket key -> { count, totalR, totalG, totalB }
  const buckets = new Map<
    number,
    { count: number; totalR: number; totalG: number; totalB: number }
  >();

  for (const { x, y } of edges) {
    const px = readPixel(grid, x, y);
    const key = bucketKey(px.r, px.g, px.b, LEVELS);
    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
      existing.totalR += px.r;
      existing.totalG += px.g;
      existing.totalB += px.b;
    } else {
      buckets.set(key, {
        count: 1,
        totalR: px.r,
        totalG: px.g,
        totalB: px.b,
      });
    }
  }

  // Find the bucket with the highest count
  let bestBucket: {
    count: number;
    totalR: number;
    totalG: number;
    totalB: number;
  } | null = null;

  for (const bucket of buckets.values()) {
    if (bestBucket === null || bucket.count > bestBucket.count) {
      bestBucket = bucket;
    }
  }

  // Should never happen if the grid has at least 1 pixel, but guard anyway
  if (bestBucket === null) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: Math.round(bestBucket.totalR / bestBucket.count),
    g: Math.round(bestBucket.totalG / bestBucket.count),
    b: Math.round(bestBucket.totalB / bestBucket.count),
  };
}

/**
 * Check whether a pixel at (x, y) is transparent (background-removed).
 *
 * A pixel is considered transparent if its alpha channel is below 10.
 */
export function isTransparent(
  grid: PixelGrid,
  x: number,
  y: number,
): boolean {
  const idx = (y * grid.width + x) * 4;
  return grid.pixels[idx + 3] < 10;
}

/**
 * Remove the background from a `PixelGrid` using edge-based flood fill.
 *
 * 1. Detect the dominant edge color.
 * 2. BFS flood fill from every edge pixel whose CIEDE2000 distance to the
 *    background color is within `tolerance`.
 * 3. Set matched (background) pixels to fully transparent (alpha = 0).
 *
 * Returns a **copy** of the grid; the original is not modified.
 *
 * @param grid      Source pixel grid (RGBA, row-major).
 * @param tolerance Maximum CIEDE2000 deltaE for a pixel to be considered
 *                  background.  Default 15.
 */
export function removeBackground(
  grid: PixelGrid,
  tolerance: number = 15,
): PixelGrid {
  const { width, height } = grid;

  // Work on a copy so the original grid is unmodified
  const pixelsCopy = new Uint8Array(grid.pixels);
  const result: PixelGrid = { width, height, pixels: pixelsCopy };

  // Step (a)/(b): detect background color from edges
  const bg = detectBackgroundColor(grid);
  const bgLab = rgbToLab(bg.r, bg.g, bg.b);

  // Visited bitmap — one bit per pixel stored as a flat Uint8Array
  const visited = new Uint8Array(width * height);

  // BFS queue stores flat pixel indices (y * width + x)
  const queue: number[] = [];

  // Step (c): seed the BFS with every edge pixel that matches the background
  const edges = edgePixelCoords(width, height);

  for (const { x, y } of edges) {
    const flatIdx = y * width + x;
    if (visited[flatIdx]) continue;

    const px = readPixel(grid, x, y);
    const pxLab = rgbToLab(px.r, px.g, px.b);
    const dist = ciede2000(pxLab, bgLab);

    if (dist <= tolerance) {
      visited[flatIdx] = 1;
      queue.push(flatIdx);
    }
  }

  // 4-connected neighbor offsets (dx, dy)
  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const flatIdx = queue[head++];
    const cx = flatIdx % width;
    const cy = (flatIdx - cx) / width;

    for (let d = 0; d < 4; d++) {
      const nx = cx + dx[d];
      const ny = cy + dy[d];

      // Bounds check
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

      const nFlat = ny * width + nx;
      if (visited[nFlat]) continue;

      const px = readPixel(grid, nx, ny);
      const pxLab = rgbToLab(px.r, px.g, px.b);
      const dist = ciede2000(pxLab, bgLab);

      if (dist <= tolerance) {
        visited[nFlat] = 1;
        queue.push(nFlat);
      } else {
        // Mark as visited so we don't recompute, but don't enqueue
        visited[nFlat] = 1;
      }
    }
  }

  // Step (d): set all queued (background) pixels to transparent
  // We need to distinguish background pixels from non-background visited
  // pixels, so rebuild a set from the queue.
  // Actually, all entries in `queue` are background pixels. Non-background
  // neighbors were marked visited but never pushed to the queue.
  for (let i = 0; i < queue.length; i++) {
    const flatIdx = queue[i];
    const dataIdx = flatIdx * 4;
    pixelsCopy[dataIdx] = 0;     // R
    pixelsCopy[dataIdx + 1] = 0; // G
    pixelsCopy[dataIdx + 2] = 0; // B
    pixelsCopy[dataIdx + 3] = 0; // A (transparent)
  }

  return result;
}
