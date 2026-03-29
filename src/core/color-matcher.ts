/**
 * Color matching module.
 *
 * Maps pixel colors to bead colors using CIEDE2000 perceptual distance,
 * with support for max color limits, palette subsets, and Floyd-Steinberg
 * dithering.
 */

import { BeadColor } from '../palettes/types';
import { rgbToLab, ciede2000, Lab } from './color-science';
import { PixelGrid } from './image-loader';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A bead pattern: a 2D grid of matched bead colors plus summary statistics.
 */
export interface BeadPattern {
  width: number;
  height: number;
  grid: BeadColor[][];  // [row][col] of matched bead colors
  colorCounts: Map<string, { color: BeadColor; count: number }>;  // key = color code
  totalBeads: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Build a Lab cache for a palette so we convert each bead color only once.
 */
function buildLabCache(palette: BeadColor[]): Map<string, Lab> {
  const cache = new Map<string, Lab>();
  for (const color of palette) {
    if (!cache.has(color.code)) {
      cache.set(color.code, rgbToLab(color.r, color.g, color.b));
    }
  }
  return cache;
}

/**
 * Find the nearest bead color for the given RGB value, using a precomputed
 * Lab cache for the palette.
 */
function findNearestBeadColor(
  r: number,
  g: number,
  b: number,
  palette: BeadColor[],
  labCache: Map<string, Lab>,
): BeadColor {
  const targetLab = rgbToLab(r, g, b);

  let bestColor: BeadColor = palette[0];
  let bestDistance = Infinity;

  for (const entry of palette) {
    const entryLab = labCache.get(entry.code)!;
    const dist = ciede2000(targetLab, entryLab);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestColor = entry;
    }
  }

  return bestColor;
}

/**
 * Build a BeadPattern from a pixel grid using the given palette and Lab cache.
 */
function buildPattern(
  pixelGrid: PixelGrid,
  palette: BeadColor[],
  labCache: Map<string, Lab>,
): BeadPattern {
  const { width, height, pixels } = pixelGrid;
  const grid: BeadColor[][] = [];
  const colorCounts = new Map<string, { color: BeadColor; count: number }>();
  let totalBeads = 0;

  for (let row = 0; row < height; row++) {
    const rowColors: BeadColor[] = [];
    for (let col = 0; col < width; col++) {
      const idx = (row * width + col) * 4;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];

      const matched = findNearestBeadColor(r, g, b, palette, labCache);
      rowColors.push(matched);
      totalBeads++;

      const existing = colorCounts.get(matched.code);
      if (existing) {
        existing.count++;
      } else {
        colorCounts.set(matched.code, { color: matched, count: 1 });
      }
    }
    grid.push(rowColors);
  }

  return { width, height, grid, colorCounts, totalBeads };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Match every pixel in the grid to the nearest bead color using CIEDE2000.
 *
 * Palette Lab values are cached so each bead color is converted only once.
 */
export function matchColors(
  pixelGrid: PixelGrid,
  palette: BeadColor[],
): BeadPattern {
  if (palette.length === 0) {
    throw new Error('matchColors: palette must not be empty');
  }

  const labCache = buildLabCache(palette);
  return buildPattern(pixelGrid, palette, labCache);
}

/**
 * Match pixels to bead colors, but limit the result to at most `maxColors`
 * distinct bead colors.
 *
 * Algorithm:
 *   1. First pass: match all pixels to nearest colors, count usage.
 *   2. If distinct colors used > maxColors, keep only the top-used colors
 *      and re-match all pixels against that reduced palette.
 */
export function matchColorsWithLimit(
  pixelGrid: PixelGrid,
  palette: BeadColor[],
  maxColors: number,
): BeadPattern {
  if (palette.length === 0) {
    throw new Error('matchColorsWithLimit: palette must not be empty');
  }
  if (maxColors < 1) {
    throw new Error('matchColorsWithLimit: maxColors must be at least 1');
  }

  // First pass: full palette match
  const labCache = buildLabCache(palette);
  const firstPass = buildPattern(pixelGrid, palette, labCache);

  // Check if we need to reduce
  if (firstPass.colorCounts.size <= maxColors) {
    return firstPass;
  }

  // Sort colors by usage (most used first) and keep top maxColors
  const sortedEntries = Array.from(firstPass.colorCounts.values())
    .sort((a, b) => b.count - a.count);

  const reducedPalette = sortedEntries
    .slice(0, maxColors)
    .map((entry) => entry.color);

  // Build a Lab cache for the reduced palette (subset of the original cache)
  const reducedLabCache = new Map<string, Lab>();
  for (const color of reducedPalette) {
    reducedLabCache.set(color.code, labCache.get(color.code)!);
  }

  // Second pass: re-match using only the reduced palette
  return buildPattern(pixelGrid, reducedPalette, reducedLabCache);
}

/**
 * Filter a palette to include only colors whose codes appear in the given
 * list.
 *
 * @throws Error if any code in `codes` is not found in the palette.
 */
export function filterPaletteBySubset(
  palette: BeadColor[],
  codes: string[],
): BeadColor[] {
  const codeSet = new Set(codes);
  const paletteMap = new Map<string, BeadColor>();

  for (const color of palette) {
    paletteMap.set(color.code, color);
  }

  const filtered: BeadColor[] = [];
  for (const code of codes) {
    const color = paletteMap.get(code);
    if (!color) {
      throw new Error(
        `filterPaletteBySubset: color code "${code}" not found in palette`,
      );
    }
    filtered.push(color);
  }

  return filtered;
}

/**
 * Apply Floyd-Steinberg dithering to a pixel grid.
 *
 * For each pixel (left to right, top to bottom):
 *   1. Find the nearest bead color.
 *   2. Compute the quantization error (original - matched) for R, G, B.
 *   3. Distribute the error to neighboring pixels:
 *      - right:        7/16
 *      - below-left:   3/16
 *      - below:        5/16
 *      - below-right:  1/16
 *
 * Returns a new PixelGrid with dithered pixel values. The original grid is
 * not modified.
 */
export function applyDithering(
  pixelGrid: PixelGrid,
  palette: BeadColor[],
): PixelGrid {
  if (palette.length === 0) {
    throw new Error('applyDithering: palette must not be empty');
  }

  const { width, height, pixels } = pixelGrid;
  const labCache = buildLabCache(palette);

  // Work on a copy of the pixel data using Float64Array for sub-pixel
  // precision during error diffusion (values can go negative or exceed 255).
  const data = new Float64Array(width * height * 4);
  for (let i = 0; i < pixels.length; i++) {
    data[i] = pixels[i];
  }

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = (row * width + col) * 4;

      // Clamp current pixel values to [0, 255] before matching
      const oldR = Math.max(0, Math.min(255, data[idx]));
      const oldG = Math.max(0, Math.min(255, data[idx + 1]));
      const oldB = Math.max(0, Math.min(255, data[idx + 2]));

      // Find nearest bead color
      const matched = findNearestBeadColor(
        Math.round(oldR),
        Math.round(oldG),
        Math.round(oldB),
        palette,
        labCache,
      );

      // Compute quantization error
      const errR = oldR - matched.r;
      const errG = oldG - matched.g;
      const errB = oldB - matched.b;

      // Write the matched color back into the data
      data[idx] = matched.r;
      data[idx + 1] = matched.g;
      data[idx + 2] = matched.b;
      // Alpha channel is left unchanged

      // Distribute error to neighbors
      // Right: (row, col + 1) -> 7/16
      if (col + 1 < width) {
        const ni = (row * width + (col + 1)) * 4;
        data[ni] += errR * (7 / 16);
        data[ni + 1] += errG * (7 / 16);
        data[ni + 2] += errB * (7 / 16);
      }

      // Below-left: (row + 1, col - 1) -> 3/16
      if (row + 1 < height && col - 1 >= 0) {
        const ni = ((row + 1) * width + (col - 1)) * 4;
        data[ni] += errR * (3 / 16);
        data[ni + 1] += errG * (3 / 16);
        data[ni + 2] += errB * (3 / 16);
      }

      // Below: (row + 1, col) -> 5/16
      if (row + 1 < height) {
        const ni = ((row + 1) * width + col) * 4;
        data[ni] += errR * (5 / 16);
        data[ni + 1] += errG * (5 / 16);
        data[ni + 2] += errB * (5 / 16);
      }

      // Below-right: (row + 1, col + 1) -> 1/16
      if (row + 1 < height && col + 1 < width) {
        const ni = ((row + 1) * width + (col + 1)) * 4;
        data[ni] += errR * (1 / 16);
        data[ni + 1] += errG * (1 / 16);
        data[ni + 2] += errB * (1 / 16);
      }
    }
  }

  // Convert back to Uint8Array, clamping to [0, 255]
  const result = new Uint8Array(width * height * 4);
  for (let i = 0; i < result.length; i++) {
    result[i] = Math.max(0, Math.min(255, Math.round(data[i])));
  }

  return { width, height, pixels: result };
}
