/**
 * BFS connected-component detection for noise cleaning.
 *
 * Finds isolated stray-color regions in a bead pattern and merges them into
 * the surrounding dominant color.  This eliminates the random speckled pixels
 * that result from nearest-color matching on noisy or anti-aliased source
 * images.
 *
 * Algorithm:
 *  1. Label every cell with a component ID via BFS flood-fill (4-connected,
 *     same bead color code).
 *  2. Identify "small" components whose size is <= mergeThreshold.
 *  3. For each small component, find the most common neighboring color and
 *     replace the entire component with it.
 *  4. Rebuild the colorCounts summary and return the cleaned pattern.
 */

import { BeadColor } from '../palettes/types';
import { rgbToLab, ciede2000 } from './color-science';
import { BeadPattern } from './color-matcher';

// ---------------------------------------------------------------------------
// Direction vectors for 4-connected neighbors (up, down, left, right)
// ---------------------------------------------------------------------------

const DX = [0, 0, -1, 1];
const DY = [-1, 1, 0, 0];

// ---------------------------------------------------------------------------
// Connected-component labelling
// ---------------------------------------------------------------------------

/**
 * BFS flood-fill to label every cell with a connected-component ID.
 *
 * Two adjacent cells (4-connected: up/down/left/right) belong to the same
 * component when they share the same bead color code.
 *
 * @param grid - The 2D bead-color grid (row-major: grid[y][x]).
 * @returns An object containing:
 *   - `labels`          – 2D array of component IDs (same dimensions as grid)
 *   - `componentSizes`  – Map from component ID to number of cells
 *   - `componentColors` – Map from component ID to the bead color code
 */
export function findConnectedComponents(
  grid: BeadColor[][],
): {
  labels: number[][];
  componentSizes: Map<number, number>;
  componentColors: Map<number, string>;
} {
  const height = grid.length;
  if (height === 0) {
    return { labels: [], componentSizes: new Map(), componentColors: new Map() };
  }
  const width = grid[0].length;

  // Initialize labels to -1 (unlabelled)
  const labels: number[][] = [];
  for (let y = 0; y < height; y++) {
    labels.push(new Array<number>(width).fill(-1));
  }

  const componentSizes = new Map<number, number>();
  const componentColors = new Map<number, string>();

  let nextId = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (labels[y][x] !== -1) {
        continue; // already labelled
      }

      // Start a new component via BFS
      const componentId = nextId++;
      const colorCode = grid[y][x].code;
      componentColors.set(componentId, colorCode);

      const queue: Array<[number, number]> = [[x, y]];
      labels[y][x] = componentId;
      let size = 0;

      while (queue.length > 0) {
        const [cx, cy] = queue.shift()!;
        size++;

        for (let d = 0; d < 4; d++) {
          const nx = cx + DX[d];
          const ny = cy + DY[d];

          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            continue;
          }
          if (labels[ny][nx] !== -1) {
            continue;
          }
          if (grid[ny][nx].code !== colorCode) {
            continue;
          }

          labels[ny][nx] = componentId;
          queue.push([nx, ny]);
        }
      }

      componentSizes.set(componentId, size);
    }
  }

  return { labels, componentSizes, componentColors };
}

// ---------------------------------------------------------------------------
// Neighbor-color census
// ---------------------------------------------------------------------------

/**
 * Find all unique colors that border a given component and count how many
 * boundary-neighbor cells have each color.
 *
 * A "boundary neighbor" is a cell that is 4-adjacent to a cell inside the
 * component but belongs to a different component.
 *
 * @param grid        - The 2D bead-color grid.
 * @param labels      - The component-ID grid produced by
 *                      {@link findConnectedComponents}.
 * @param componentId - The ID of the component to inspect.
 * @param width       - Grid width.
 * @param height      - Grid height.
 * @returns Map from color code to an object holding the BeadColor and the
 *          number of neighboring cells with that color.
 */
export function getNeighborColors(
  grid: BeadColor[][],
  labels: number[][],
  componentId: number,
  width: number,
  height: number,
): Map<string, { color: BeadColor; count: number }> {
  const result = new Map<string, { color: BeadColor; count: number }>();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (labels[y][x] !== componentId) {
        continue;
      }

      // Check all 4-connected neighbors
      for (let d = 0; d < 4; d++) {
        const nx = x + DX[d];
        const ny = y + DY[d];

        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          continue;
        }
        if (labels[ny][nx] === componentId) {
          continue; // same component — skip
        }

        const neighborColor = grid[ny][nx];
        const code = neighborColor.code;
        const entry = result.get(code);
        if (entry) {
          entry.count++;
        } else {
          result.set(code, { color: neighborColor, count: 1 });
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Deep-copy helper
// ---------------------------------------------------------------------------

/**
 * Create an independent deep copy of a BeadPattern so that mutations do not
 * affect the original.
 */
function deepCopyPattern(pattern: BeadPattern): BeadPattern {
  const grid: BeadColor[][] = pattern.grid.map((row) =>
    row.map((cell) => ({ ...cell })),
  );

  const colorCounts = new Map<string, { color: BeadColor; count: number }>();
  for (const [code, entry] of pattern.colorCounts) {
    colorCounts.set(code, { color: { ...entry.color }, count: entry.count });
  }

  return {
    grid,
    width: pattern.width,
    height: pattern.height,
    colorCounts,
    totalBeads: pattern.totalBeads,
  };
}

// ---------------------------------------------------------------------------
// Rebuild colorCounts from the grid
// ---------------------------------------------------------------------------

/**
 * Recompute the `colorCounts` map by scanning every cell in the grid.
 */
function rebuildColorCounts(
  grid: BeadColor[][],
): Map<string, { color: BeadColor; count: number }> {
  const counts = new Map<string, { color: BeadColor; count: number }>();

  for (const row of grid) {
    for (const cell of row) {
      const code = cell.code;
      const entry = counts.get(code);
      if (entry) {
        entry.count++;
      } else {
        counts.set(code, { color: cell, count: 1 });
      }
    }
  }

  return counts;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Remove noise from a bead pattern by merging small connected components into
 * the most common surrounding color.
 *
 * The algorithm uses BFS to detect connected components of identical bead
 * colors.  Any component whose size is at most `mergeThreshold` is replaced
 * with the color that appears most often among its 4-connected neighbors.
 *
 * The original pattern is **not** mutated; a deep copy is returned.
 *
 * @param pattern        - The bead pattern to clean.
 * @param mergeThreshold - Maximum component size (inclusive) that will be
 *                         merged. Defaults to 3.
 * @returns A new, cleaned BeadPattern.
 */
export function cleanNoise(
  pattern: BeadPattern,
  mergeThreshold: number = 3,
): BeadPattern {
  const cleaned = deepCopyPattern(pattern);
  const { grid, width, height } = cleaned;

  // Step 1: Find connected components
  const { labels, componentSizes, componentColors } =
    findConnectedComponents(grid);

  // Step 2 & 3: Merge small components into the most common neighbor color
  for (const [componentId, size] of componentSizes) {
    if (size > mergeThreshold) {
      continue; // large enough — keep it
    }

    // Find the most common neighboring color
    const neighbors = getNeighborColors(grid, labels, componentId, width, height);

    if (neighbors.size === 0) {
      // No neighbors at all (e.g. the entire grid is one color) — skip
      continue;
    }

    // Pick the color with the highest count among neighbors
    let bestColor: BeadColor | null = null;
    let bestCount = -1;
    for (const [, entry] of neighbors) {
      if (entry.count > bestCount) {
        bestCount = entry.count;
        bestColor = entry.color;
      }
    }

    if (bestColor === null) {
      continue;
    }

    // Replace every cell in this small component with the winning neighbor color
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (labels[y][x] === componentId) {
          grid[y][x] = { ...bestColor };
        }
      }
    }
  }

  // Step 4: Rebuild the colorCounts map from the modified grid
  cleaned.colorCounts = rebuildColorCounts(grid);

  return cleaned;
}
