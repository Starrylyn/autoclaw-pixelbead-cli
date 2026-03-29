/**
 * Demo pattern generator.
 *
 * Programmatically creates sample pixel-art patterns to showcase the tool's
 * capabilities without needing an input image.  Three patterns are generated:
 *
 *   1. A 16x16 heart icon (red on white)
 *   2. A 16x16 Mario-style mushroom (multi-color pixel art)
 *   3. A 29x29 gradient landscape scene (sky, sun, ground)
 *
 * Each pattern is run through the standard pipeline: palette matching, noise
 * cleaning, material-list generation, terminal preview, and (optionally) PNG
 * output.
 */

import * as path from 'path';
import * as fs from 'fs';
import { PixelGrid } from '../core/image-loader';
import { matchColors, matchColorsWithLimit } from '../core/color-matcher';
import { cleanNoise } from '../core/noise-cleaner';
import { getPalette } from '../palettes';
import { generateMaterialList, formatMaterialListText } from '../core/materials';
import { renderTerminalPreview, renderTerminalMaterialList } from '../output/terminal';
import { renderPngGrid } from '../output/png-grid';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DemoOptions {
  output?: string; // output directory, default './demo'
}

// ---------------------------------------------------------------------------
// Helper: create a PixelGrid from a per-pixel color function
// ---------------------------------------------------------------------------

/**
 * Build a {@link PixelGrid} by evaluating a color function at every (x, y)
 * position.
 *
 * @param width   Grid width in pixels / beads.
 * @param height  Grid height in pixels / beads.
 * @param colorFn Returns [R, G, B, A] for the given column (x) and row (y).
 */
function createPixelGrid(
  width: number,
  height: number,
  colorFn: (x: number, y: number) => [number, number, number, number],
): PixelGrid {
  const pixels = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = colorFn(x, y);
      const idx = (y * width + x) * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;
    }
  }

  return { width, height, pixels };
}

// ---------------------------------------------------------------------------
// Pattern 1: Heart Icon (16x16)
// ---------------------------------------------------------------------------

/**
 * A 16x16 heart shape.  Each row is a string of 16 characters where '.' is
 * background (white) and 'X' is the heart (red).
 */
const HEART_ROWS: string[] = [
  '................',
  '................',
  '..XX....XX......',
  '.XXXX..XXXX.....',
  '.XXXXXXXXXXX....',
  '.XXXXXXXXXXX....',
  '.XXXXXXXXXXX....',
  '..XXXXXXXXX.....',
  '..XXXXXXXXX.....',
  '...XXXXXXX......',
  '...XXXXXXX......',
  '....XXXXX.......',
  '....XXXXX.......',
  '.....XXX........',
  '......X.........',
  '................',
];

function createHeartGrid(): PixelGrid {
  return createPixelGrid(16, 16, (x, y) => {
    const row = HEART_ROWS[y];
    if (row && row[x] === 'X') {
      return [255, 0, 0, 255]; // red
    }
    return [255, 255, 255, 255]; // white background
  });
}

// ---------------------------------------------------------------------------
// Pattern 2: Mario-style Mushroom (16x16)
// ---------------------------------------------------------------------------

/**
 * A 16x16 pixel-art mushroom.  Legend:
 *   '.' = white background
 *   'K' = black outline
 *   'R' = red cap
 *   'W' = white spot
 *   'C' = cream / tan stem
 *   'B' = beige (lighter stem)
 */
const MUSHROOM_ROWS: string[] = [
  '....KKKKKK......',
  '...KRRRRRRK.....',
  '..KRWWRRRRRK....',
  '..KRWWRRWWRK....',
  '.KRRRRRRWWRRK...',
  '.KRRRRRRRRRRK...',
  '.KRRRRRRRRRRK...',
  '..KKKKKKKKK.....',
  '...KCCBBCCK.....',
  '..KCCCBBCCCK....',
  '..KCCCBBCCCK....',
  '..KCCCBBCCCK....',
  '..KCCCCCCCCK....',
  '...KCCCCCCCK....',
  '...KKKKKKKKK....',
  '................',
];

function createMushroomGrid(): PixelGrid {
  const colorMap: Record<string, [number, number, number, number]> = {
    '.': [255, 255, 255, 255], // white background
    'K': [0, 0, 0, 255],       // black outline
    'R': [220, 30, 30, 255],   // red cap
    'W': [255, 255, 255, 255], // white spot
    'C': [230, 200, 160, 255], // cream stem
    'B': [245, 230, 200, 255], // beige highlight
  };

  return createPixelGrid(16, 16, (x, y) => {
    const row = MUSHROOM_ROWS[y];
    const ch = row ? row[x] : '.';
    return colorMap[ch] ?? [255, 255, 255, 255];
  });
}

// ---------------------------------------------------------------------------
// Pattern 3: Gradient Landscape Scene (29x29)
// ---------------------------------------------------------------------------

/**
 * Create a 29x29 gradient landscape with:
 *   - Sky gradient: light blue (top) -> deeper blue (middle)
 *   - Green ground band at the bottom
 *   - Yellow sun circle in the upper-right area
 */
function createGradientSceneGrid(): PixelGrid {
  const W = 29;
  const H = 29;

  // Sun center and radius (upper-right area)
  const sunCx = 22;
  const sunCy = 6;
  const sunR = 4;

  // Ground starts at this row (inclusive)
  const groundStart = 22;

  return createPixelGrid(W, H, (x, y) => {
    // Distance from sun center
    const dx = x - sunCx;
    const dy = y - sunCy;
    const distSun = Math.sqrt(dx * dx + dy * dy);

    // --- Sun ---
    if (distSun <= sunR && y < groundStart) {
      // Bright yellow core fading to orange at the edge
      const t = distSun / sunR;
      const r = Math.round(255);
      const g = Math.round(255 - t * 55); // 255 -> 200
      const b = Math.round(50 - t * 50);  // 50 -> 0
      return [r, g, b, 255];
    }

    // --- Ground ---
    if (y >= groundStart) {
      // Green gradient: lighter at top of ground, darker at bottom
      const t = (y - groundStart) / (H - 1 - groundStart);
      const r = Math.round(40 + t * 10);
      const g = Math.round(160 - t * 60);
      const b = Math.round(40 + t * 10);
      return [r, g, b, 255];
    }

    // --- Sky gradient ---
    // t goes from 0 (top) to 1 (just above ground)
    const t = y / (groundStart - 1);
    const r = Math.round(135 - t * 40);  // 135 -> 95
    const g = Math.round(206 - t * 40);  // 206 -> 166
    const b = Math.round(250 - t * 30);  // 250 -> 220
    return [r, g, b, 255];
  });
}

// ---------------------------------------------------------------------------
// Process and display a single demo pattern
// ---------------------------------------------------------------------------

async function processDemoPattern(
  name: string,
  grid: PixelGrid,
  outputDir: string | undefined,
  index: number,
): Promise<void> {
  const palette = getPalette('artkal');

  // 1. Match colors with a 15-color limit
  const matched = matchColorsWithLimit(grid, palette.colors, 15);

  // 2. Clean noise
  const cleaned = cleanNoise(matched);

  // 3. Generate material list
  const materialList = generateMaterialList(cleaned, palette.brand);
  const materialText = formatMaterialListText(materialList);

  // 4. Terminal preview
  console.log('');
  console.log(`${'='.repeat(60)}`);
  console.log(`  Demo Pattern ${index + 1}: ${name}`);
  console.log(`  Size: ${grid.width}x${grid.height}  |  Colors used: ${cleaned.colorCounts.size}`);
  console.log(`${'='.repeat(60)}`);
  console.log('');
  console.log(renderTerminalPreview(cleaned));
  console.log('');
  console.log(renderTerminalMaterialList(cleaned));
  console.log('');
  console.log(materialText);

  // 5. Save PNG if output directory is specified
  if (outputDir) {
    const filename = `demo-${index + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    const outputPath = path.join(outputDir, filename);
    await renderPngGrid(cleaned, outputPath, {
      cellSize: 24,
      showCodes: true,
      showLegend: true,
      showMaterials: true,
    });
    console.log(`  PNG saved: ${outputPath}`);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run the demo: generate three sample patterns, display them in the terminal,
 * and optionally save PNG grid images to an output directory.
 *
 * @param options.output  Directory for PNG output files.  Created if it does
 *                        not exist.  Defaults to `'./demo'`.
 */
export async function runDemo(options: DemoOptions): Promise<void> {
  const outputDir = options.output ?? './demo';

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('');
  console.log('PixelBead Demo - Generating sample patterns...');
  console.log(`Output directory: ${path.resolve(outputDir)}`);

  // Define the three demo patterns
  const patterns: Array<{ name: string; grid: PixelGrid }> = [
    { name: 'Heart Icon', grid: createHeartGrid() },
    { name: 'Pixel Mushroom', grid: createMushroomGrid() },
    { name: 'Gradient Landscape', grid: createGradientSceneGrid() },
  ];

  for (let i = 0; i < patterns.length; i++) {
    const { name, grid } = patterns[i];
    await processDemoPattern(name, grid, outputDir, i);
  }

  console.log('');
  console.log(`${'='.repeat(60)}`);
  console.log('  Demo complete!');
  console.log(`  ${patterns.length} patterns generated.`);
  if (outputDir) {
    console.log(`  PNG files saved to: ${path.resolve(outputDir)}`);
  }
  console.log(`${'='.repeat(60)}`);
  console.log('');
}
