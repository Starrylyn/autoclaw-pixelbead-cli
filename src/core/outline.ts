/**
 * Optional outline enhancement around the subject for better contrast.
 *
 * Detects edges in the bead pattern and darkens them, producing a subtle
 * outline that separates the subject from the background and improves
 * visual clarity at small bead sizes.
 */

import { BeadColor } from '../palettes/types';
import { BeadPattern } from './color-matcher';
import { rgbToLab, ciede2000, findNearestColor, labToRgb } from './color-science';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** CIEDE2000 threshold above which two neighbouring cells are considered
 *  significantly different in colour (i.e. an edge). */
const EDGE_COLOR_THRESHOLD = 20;

/** Primary L* reduction for darkening an outline bead. */
const DARKEN_PRIMARY = 25;

/** Fallback L* reduction when the primary darkening maps to the same bead. */
const DARKEN_FALLBACK = 40;

/** Minimum L* value after darkening (avoid pure black artifacts). */
const MIN_LIGHTNESS = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Check whether a bead colour is "transparent" / background.
 *
 * A bead whose English name contains "transparent" or "clear" is treated
 * as background.  This heuristic works across all supported palettes.
 */
function isTransparent(bead: BeadColor): boolean {
  const name = bead.nameEn.toLowerCase();
  if (name.includes('transparent') || name.includes('clear')) {
    return true;
  }
  return false;
}

/**
 * Deep-clone a BeadPattern so that mutations don't affect the original.
 */
function clonePattern(pattern: BeadPattern): BeadPattern {
  const newGrid: BeadColor[][] = pattern.grid.map((row) =>
    row.map((cell) => ({ ...cell })),
  );

  const newColorCounts = new Map<string, { color: BeadColor; count: number }>();
  pattern.colorCounts.forEach((value, key) => {
    newColorCounts.set(key, { color: { ...value.color }, count: value.count });
  });

  return {
    width: pattern.width,
    height: pattern.height,
    grid: newGrid,
    colorCounts: newColorCounts,
    totalBeads: pattern.totalBeads,
  };
}

/**
 * Rebuild the `colorCounts` map from the grid contents.
 */
function rebuildColorCounts(pattern: BeadPattern): void {
  pattern.colorCounts.clear();
  for (let y = 0; y < pattern.height; y++) {
    for (let x = 0; x < pattern.width; x++) {
      const cell = pattern.grid[y][x];
      if (!isTransparent(cell)) {
        const key = `${cell.brand}:${cell.code}`;
        const existing = pattern.colorCounts.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          pattern.colorCounts.set(key, { color: { ...cell }, count: 1 });
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4-connected neighbour offsets
// ---------------------------------------------------------------------------

const DX = [0, 0, -1, 1];
const DY = [-1, 1, 0, 0];

// ---------------------------------------------------------------------------
// Edge detection
// ---------------------------------------------------------------------------

/**
 * Detect edge cells in the pattern.
 *
 * A cell is an "edge" if it is non-transparent AND at least one of its
 * 4-connected neighbours is either:
 *   - transparent / background, OR
 *   - a significantly different colour (CIEDE2000 > {@link EDGE_COLOR_THRESHOLD}).
 *
 * @returns A 2-D boolean grid (`[row][col]`) where `true` marks an edge cell.
 */
export function detectEdges(pattern: BeadPattern): boolean[][] {
  const { width, height, grid } = pattern;
  const edges: boolean[][] = [];

  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];

      // Transparent cells are never edges.
      if (isTransparent(cell)) {
        row.push(false);
        continue;
      }

      const cellLab = rgbToLab(cell.r, cell.g, cell.b);
      let isEdge = false;

      for (let d = 0; d < 4; d++) {
        const nx = x + DX[d];
        const ny = y + DY[d];

        // Boundary neighbours count as transparent.
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          isEdge = true;
          break;
        }

        const neighbour = grid[ny][nx];

        if (isTransparent(neighbour)) {
          isEdge = true;
          break;
        }

        // Check colour difference.
        const neighbourLab = rgbToLab(neighbour.r, neighbour.g, neighbour.b);
        if (ciede2000(cellLab, neighbourLab) > EDGE_COLOR_THRESHOLD) {
          isEdge = true;
          break;
        }
      }

      row.push(isEdge);
    }
    edges.push(row);
  }

  return edges;
}

// ---------------------------------------------------------------------------
// Colour darkening
// ---------------------------------------------------------------------------

/**
 * Darken a bead colour and find the nearest match in the palette.
 *
 * Steps:
 * 1. Convert the input colour to CIELAB.
 * 2. Reduce L* by {@link DARKEN_PRIMARY} (clamped to {@link MIN_LIGHTNESS}).
 * 3. Convert back to sRGB and find the nearest palette colour.
 * 4. If the result is the same bead as the input, try reducing L* by
 *    {@link DARKEN_FALLBACK} instead.
 *
 * @returns The darkened palette colour.
 */
export function darkenColor(color: BeadColor, palette: BeadColor[]): BeadColor {
  const lab = rgbToLab(color.r, color.g, color.b);

  // --- Primary darkening attempt ---
  const darkenedL = Math.max(MIN_LIGHTNESS, lab.L - DARKEN_PRIMARY);
  const darkenedRgb = labToRgb(darkenedL, lab.a, lab.b);
  const nearest = findNearestColor(darkenedRgb.r, darkenedRgb.g, darkenedRgb.b, palette);

  // If the nearest bead is different from the original, use it.
  if (nearest.color.brand !== color.brand || nearest.color.code !== color.code) {
    return nearest.color;
  }

  // --- Fallback: more aggressive darkening ---
  const fallbackL = Math.max(MIN_LIGHTNESS, lab.L - DARKEN_FALLBACK);
  const fallbackRgb = labToRgb(fallbackL, lab.a, lab.b);
  const fallbackNearest = findNearestColor(
    fallbackRgb.r,
    fallbackRgb.g,
    fallbackRgb.b,
    palette,
  );

  return fallbackNearest.color;
}

// ---------------------------------------------------------------------------
// Main outline function
// ---------------------------------------------------------------------------

/**
 * Add an outline to the bead pattern for improved contrast.
 *
 * The algorithm:
 * 1. Detect edge cells in the pattern.
 * 2. For each edge cell, replace it with a darker version of its current
 *    colour (found via {@link darkenColor}).
 * 3. Rebuild colour counts and return the modified pattern.
 *
 * The input pattern is **not** mutated; a deep copy is returned.
 */
export function addOutline(pattern: BeadPattern, palette: BeadColor[]): BeadPattern {
  const result = clonePattern(pattern);
  const edges = detectEdges(pattern);

  for (let y = 0; y < result.height; y++) {
    for (let x = 0; x < result.width; x++) {
      if (!edges[y][x]) {
        continue;
      }

      const cell = result.grid[y][x];
      if (isTransparent(cell)) {
        continue;
      }

      const darkened = darkenColor(cell, palette);

      // Only replace if the darkened bead is actually different.
      if (darkened.brand !== cell.brand || darkened.code !== cell.code) {
        result.grid[y][x] = { ...darkened };
      }
    }
  }

  rebuildColorCounts(result);

  return result;
}
