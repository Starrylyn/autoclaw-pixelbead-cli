/**
 * Terminal output module.
 *
 * Renders bead patterns as colored blocks in the terminal using ANSI 24-bit
 * (true-color) escape sequences. No external dependencies (e.g. chalk) are
 * used; all color output is driven by raw escape codes.
 */

import { BeadPattern } from '../core/color-matcher';
import { BeadColor } from '../palettes/types';

// ---------------------------------------------------------------------------
// ANSI helpers
// ---------------------------------------------------------------------------

const ESC = '\x1b';
const RESET = `${ESC}[0m`;

/** Set 24-bit foreground color. */
function fg(r: number, g: number, b: number): string {
  return `${ESC}[38;2;${r};${g};${b}m`;
}

/** Set 24-bit background color. */
function bg(r: number, g: number, b: number): string {
  return `${ESC}[48;2;${r};${g};${b}m`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Full-block character used to render a bead cell. */
const BLOCK = '\u2588\u2588'; // "██"

/** Two spaces – used for transparent / empty cells. */
const EMPTY = '  ';

/**
 * Detect whether a bead color should be treated as transparent / background.
 *
 * A cell is considered transparent when:
 *   - Its code contains the substring "transparent" (case-insensitive), OR
 *   - Its RGB values are all 0 AND the code/name hints at transparency.
 *
 * Because the `BeadColor` type does not carry an explicit alpha channel we
 * rely on the code-based heuristic.  If callers want to extend this in the
 * future they can adjust the check here.
 */
function isTransparent(bead: BeadColor): boolean {
  return bead.code.toLowerCase().includes('transparent');
}

/**
 * Pad a string to a given width (right-padded with spaces).
 */
function padRight(s: string, width: number): string {
  if (s.length >= width) {
    return s;
  }
  return s + ' '.repeat(width - s.length);
}

/**
 * Pad a number to a given width (left-padded with spaces).
 */
function padLeft(n: number | string, width: number): string {
  const s = String(n);
  if (s.length >= width) {
    return s;
  }
  return ' '.repeat(width - s.length) + s;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Render a bead pattern as colored Unicode blocks suitable for display in a
 * terminal that supports ANSI 24-bit (true-color) escape codes.
 *
 * Features:
 *   - Each bead cell is rendered as two full-block characters ("██") with the
 *     matching background color set via `\x1b[48;2;R;G;Bm`.
 *   - Row and column numbers are printed for reference at every 5th position.
 *   - Transparent / background cells are rendered as two spaces with no color.
 *   - A blank line is inserted between groups of rows at board boundaries
 *     (every 29 rows, matching standard peg-board dimensions).
 */
export function renderTerminalPreview(pattern: BeadPattern): string {
  const { width, height, grid } = pattern;
  const lines: string[] = [];

  // Width of the row-number gutter (enough to hold the largest row index).
  const gutterWidth = String(height - 1).length + 1;

  // ------ Column header ------
  {
    let header = ' '.repeat(gutterWidth);
    for (let col = 0; col < width; col++) {
      if (col % 5 === 0) {
        const label = String(col);
        header += padRight(label, 2);
      } else {
        header += '  ';
      }
    }
    lines.push(header);
  }

  // ------ Rows ------
  for (let row = 0; row < height; row++) {
    // Board boundary separator (every 29 rows, skipping the first).
    if (row > 0 && row % 29 === 0) {
      lines.push('');
    }

    let line = '';

    // Row number gutter – print number at every 5th row, otherwise spaces.
    if (row % 5 === 0) {
      line += padLeft(row, gutterWidth);
    } else {
      line += ' '.repeat(gutterWidth);
    }

    // Cells
    for (let col = 0; col < width; col++) {
      const bead = grid[row][col];
      if (isTransparent(bead)) {
        line += EMPTY;
      } else {
        line += `${bg(bead.r, bead.g, bead.b)}${BLOCK}${RESET}`;
      }
    }

    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * Render the material / color usage list for a pattern as a formatted table
 * with colored swatches, sorted by bead count descending.
 *
 * Example output line:
 *   ██ C01  Black          1234
 */
export function renderTerminalMaterialList(pattern: BeadPattern): string {
  const entries = Array.from(pattern.colorCounts.values()).sort(
    (a, b) => b.count - a.count,
  );

  // Determine column widths.
  let maxCodeLen = 4; // minimum "Code" header width
  let maxNameLen = 4; // minimum "Name" header width
  let maxCountLen = 5; // minimum "Count" header width

  for (const entry of entries) {
    maxCodeLen = Math.max(maxCodeLen, entry.color.code.length);
    maxNameLen = Math.max(maxNameLen, entry.color.nameEn.length);
    maxCountLen = Math.max(maxCountLen, String(entry.count).length);
  }

  const lines: string[] = [];

  // Header
  lines.push(
    `     ${padRight('Code', maxCodeLen)}  ${padRight('Name', maxNameLen)}  ${padLeft('Count', maxCountLen)}`,
  );
  lines.push(
    `     ${'-'.repeat(maxCodeLen)}  ${'-'.repeat(maxNameLen)}  ${'-'.repeat(maxCountLen)}`,
  );

  // Rows
  for (const entry of entries) {
    const { color, count } = entry;
    const swatch = `${fg(color.r, color.g, color.b)}${BLOCK}${RESET}`;
    const code = padRight(color.code, maxCodeLen);
    const name = padRight(color.nameEn, maxNameLen);
    const cnt = padLeft(count, maxCountLen);
    lines.push(`${swatch}  ${code}  ${name}  ${cnt}`);
  }

  // Total
  const totalLabel = 'Total';
  const totalPad = 5 + maxCodeLen + 2 + maxNameLen + 2;
  lines.push(`${' '.repeat(totalPad)}${padLeft(pattern.totalBeads, maxCountLen)}`);

  return lines.join('\n');
}

/**
 * Render every color in a palette as a formatted table, including a header
 * with brand information.
 *
 * Each line contains: swatch, code, English name, Chinese name, hex value.
 */
export function renderTerminalPaletteList(
  palette: { brand: string; brandCn: string; beadSize: string; colors: BeadColor[] },
): string {
  const { brand, brandCn, beadSize, colors } = palette;

  // Determine column widths.
  let maxCodeLen = 4;
  let maxEnLen = 7; // "English"
  let maxCnLen = 4; // header placeholder
  let maxHexLen = 3; // "Hex"

  for (const c of colors) {
    maxCodeLen = Math.max(maxCodeLen, c.code.length);
    maxEnLen = Math.max(maxEnLen, c.nameEn.length);
    maxCnLen = Math.max(maxCnLen, c.nameCn.length);
    maxHexLen = Math.max(maxHexLen, c.hex.length);
  }

  const lines: string[] = [];

  // Brand header
  lines.push(`${brand} (${brandCn})  -  Bead size: ${beadSize}`);
  lines.push(`${colors.length} colors`);
  lines.push('');

  // Table header
  lines.push(
    `     ${padRight('Code', maxCodeLen)}  ${padRight('English', maxEnLen)}  ${padRight('Chinese', maxCnLen)}  ${padRight('Hex', maxHexLen)}`,
  );
  lines.push(
    `     ${'-'.repeat(maxCodeLen)}  ${'-'.repeat(maxEnLen)}  ${'-'.repeat(maxCnLen)}  ${'-'.repeat(maxHexLen)}`,
  );

  // Color rows
  for (const c of colors) {
    const swatch = `${fg(c.r, c.g, c.b)}${BLOCK}${RESET}`;
    const code = padRight(c.code, maxCodeLen);
    const nameEn = padRight(c.nameEn, maxEnLen);
    const nameCn = padRight(c.nameCn, maxCnLen);
    const hex = padRight(c.hex, maxHexLen);
    lines.push(`${swatch}  ${code}  ${nameEn}  ${nameCn}  ${hex}`);
  }

  return lines.join('\n');
}
