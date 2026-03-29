/**
 * Bill of materials generator for bead patterns.
 *
 * Produces sorted material lists from a BeadPattern, with formatters for
 * plain-text tables and CSV export.
 */

import { BeadPattern } from './color-matcher';
import { BeadColor } from '../palettes/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MaterialEntry {
  color: BeadColor;
  count: number;
  percentage: number;  // percentage of total beads
}

export interface MaterialList {
  entries: MaterialEntry[];  // sorted by count descending
  totalBeads: number;
  totalColors: number;
  brand: string;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/**
 * Generate a bill of materials from a bead pattern.
 *
 * Extracts color counts, sorts by count descending (most used first),
 * and calculates the percentage each color represents of the total.
 */
export function generateMaterialList(
  pattern: BeadPattern,
  brand: string,
): MaterialList {
  const { colorCounts, totalBeads } = pattern;

  const entries: MaterialEntry[] = Array.from(colorCounts.values()).map(
    ({ color, count }) => ({
      color,
      count,
      percentage: totalBeads > 0 ? (count / totalBeads) * 100 : 0,
    }),
  );

  // Sort by count descending (most used first)
  entries.sort((a, b) => b.count - a.count);

  return {
    entries,
    totalBeads,
    totalColors: entries.length,
    brand,
  };
}

// ---------------------------------------------------------------------------
// Plain-text formatter
// ---------------------------------------------------------------------------

/**
 * Format a material list as a plain-text table.
 *
 * Columns: #, Code, Name (EN), Name (CN), Hex, Count, %
 * Numbers are right-aligned. Includes header/footer borders and totals.
 */
export function formatMaterialListText(list: MaterialList): string {
  const { entries, totalBeads, totalColors, brand } = list;

  // Determine column widths by scanning all entries
  const numWidth = Math.max(1, String(entries.length).length);
  const codeWidth = Math.max(4, ...entries.map((e) => e.color.code.length));
  const nameEnWidth = Math.max(4, ...entries.map((e) => e.color.nameEn.length));
  const nameCnWidth = Math.max(4, ...entries.map((e) => e.color.nameCn.length));
  const hexWidth = 7; // #RRGGBB is always 7 chars
  const countWidth = Math.max(5, ...entries.map((e) => String(e.count).length));
  const pctWidth = Math.max(5, ...entries.map((e) => formatPct(e.percentage).length));

  // Build the ruler width from all columns + spacing
  const columns = [
    numWidth,    // #
    codeWidth,   // Code
    nameEnWidth, // Name
    nameCnWidth, // Chinese name
    hexWidth,    // Hex
    countWidth,  // Count
    pctWidth,    // %
  ];
  // Each column is separated by 3 spaces ("   ")
  const totalWidth = columns.reduce((sum, w) => sum + w, 0) + (columns.length - 1) * 3;

  const lines: string[] = [];

  // Title
  lines.push(`Material List - ${brand}`);
  lines.push('\u2550'.repeat(totalWidth));

  // Header
  lines.push(
    [
      padLeft('#', numWidth),
      padRight('Code', codeWidth),
      padRight('Name', nameEnWidth),
      padRight('\u4E2D\u6587\u540D', nameCnWidth),
      padRight('Hex', hexWidth),
      padLeft('Count', countWidth),
      padLeft('%', pctWidth),
    ].join('   '),
  );

  // Separator
  lines.push('\u2500'.repeat(totalWidth));

  // Rows
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    lines.push(
      [
        padLeft(String(i + 1), numWidth),
        padRight(e.color.code, codeWidth),
        padRight(e.color.nameEn, nameEnWidth),
        padRight(e.color.nameCn, nameCnWidth),
        padRight(e.color.hex, hexWidth),
        padLeft(String(e.count), countWidth),
        padLeft(formatPct(e.percentage), pctWidth),
      ].join('   '),
    );
  }

  // Footer
  lines.push('\u2550'.repeat(totalWidth));
  lines.push(`Total: ${totalBeads} beads, ${totalColors} colors`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// CSV formatter
// ---------------------------------------------------------------------------

/**
 * Format a material list as CSV for spreadsheet import.
 *
 * Header: Code,Name_EN,Name_CN,Hex,Count,Percentage
 */
export function formatMaterialListCsv(list: MaterialList): string {
  const lines: string[] = [];

  lines.push('Code,Name_EN,Name_CN,Hex,Count,Percentage');

  for (const entry of list.entries) {
    lines.push(
      [
        csvEscape(entry.color.code),
        csvEscape(entry.color.nameEn),
        csvEscape(entry.color.nameCn),
        csvEscape(entry.color.hex),
        String(entry.count),
        formatPct(entry.percentage),
      ].join(','),
    );
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Format a percentage value to one decimal place with a trailing '%'.
 */
function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Pad a string on the left to the given width.
 */
function padLeft(s: string, width: number): string {
  return s.padStart(width);
}

/**
 * Pad a string on the right to the given width.
 */
function padRight(s: string, width: number): string {
  return s.padEnd(width);
}

/**
 * Escape a value for CSV output. Wraps in double quotes if the value
 * contains a comma, double quote, or newline.
 */
function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
