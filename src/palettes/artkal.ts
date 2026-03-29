import { BeadColor, Palette } from './types';

/**
 * Parse a hex color string into r, g, b components.
 * Accepts formats: '#RRGGBB' or 'RRGGBB'.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, '');
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

/**
 * Raw Artkal C-series (2.6mm) bead colors.
 * The r, g, b fields are placeholder zeros and will be computed from hex below.
 */
const rawColors: Omit<BeadColor, 'r' | 'g' | 'b'>[] = [
  // === Whites & Near Whites ===
  { brand: 'artkal', code: 'C-1',  nameEn: 'White',              nameCn: '\u767D\u8272',     hex: '#FFFFFF' },
  { brand: 'artkal', code: 'C-2',  nameEn: 'Cream White',        nameCn: '\u4E73\u767D\u8272',   hex: '#FFF8E7' },
  { brand: 'artkal', code: 'C-3',  nameEn: 'Ivory',              nameCn: '\u8C61\u7259\u767D',   hex: '#F5F0DC' },
  { brand: 'artkal', code: 'C-4',  nameEn: 'Light Yellow',       nameCn: '\u6D45\u9EC4\u8272',   hex: '#FFF5A0' },

  // === Yellows ===
  { brand: 'artkal', code: 'C-5',  nameEn: 'Yellow',             nameCn: '\u9EC4\u8272',     hex: '#FFE600' },
  { brand: 'artkal', code: 'C-6',  nameEn: 'Golden Yellow',      nameCn: '\u91D1\u9EC4\u8272',   hex: '#FFC800' },
  { brand: 'artkal', code: 'C-7',  nameEn: 'Dark Yellow',        nameCn: '\u6DF1\u9EC4\u8272',   hex: '#F0A800' },
  { brand: 'artkal', code: 'C-8',  nameEn: 'Warm Yellow',        nameCn: '\u6696\u9EC4\u8272',   hex: '#FFD23F' },

  // === Oranges ===
  { brand: 'artkal', code: 'C-9',  nameEn: 'Light Orange',       nameCn: '\u6D45\u6A59\u8272',   hex: '#FFA552' },
  { brand: 'artkal', code: 'C-10', nameEn: 'Orange',             nameCn: '\u6A59\u8272',     hex: '#FF8C00' },
  { brand: 'artkal', code: 'C-11', nameEn: 'Dark Orange',        nameCn: '\u6DF1\u6A59\u8272',   hex: '#E06800' },
  { brand: 'artkal', code: 'C-12', nameEn: 'Tangerine',          nameCn: '\u6A58\u7EA2\u8272',   hex: '#FF6020' },

  // === Reds ===
  { brand: 'artkal', code: 'C-13', nameEn: 'Light Red',          nameCn: '\u6D45\u7EA2\u8272',   hex: '#FF6B6B' },
  { brand: 'artkal', code: 'C-14', nameEn: 'Red',                nameCn: '\u7EA2\u8272',     hex: '#E60012' },
  { brand: 'artkal', code: 'C-15', nameEn: 'Dark Red',           nameCn: '\u6DF1\u7EA2\u8272',   hex: '#B80020' },
  { brand: 'artkal', code: 'C-16', nameEn: 'Wine Red',           nameCn: '\u9152\u7EA2\u8272',   hex: '#8B1A2B' },
  { brand: 'artkal', code: 'C-17', nameEn: 'Crimson',            nameCn: '\u7EEF\u7EA2\u8272',   hex: '#D0021B' },

  // === Pinks ===
  { brand: 'artkal', code: 'C-18', nameEn: 'Light Pink',         nameCn: '\u6D45\u7C89\u8272',   hex: '#FFB6C1' },
  { brand: 'artkal', code: 'C-19', nameEn: 'Pink',               nameCn: '\u7C89\u8272',     hex: '#FF69B4' },
  { brand: 'artkal', code: 'C-20', nameEn: 'Hot Pink',           nameCn: '\u8273\u7C89\u8272',   hex: '#FF1493' },
  { brand: 'artkal', code: 'C-21', nameEn: 'Rose Pink',          nameCn: '\u73AB\u7470\u7C89',   hex: '#F4758E' },
  { brand: 'artkal', code: 'C-22', nameEn: 'Salmon Pink',        nameCn: '\u9C91\u9C7C\u7C89',   hex: '#F7A4A4' },

  // === Purples ===
  { brand: 'artkal', code: 'C-23', nameEn: 'Lavender',           nameCn: '\u85B0\u8863\u8349\u7D2B', hex: '#C4A6D7' },
  { brand: 'artkal', code: 'C-24', nameEn: 'Light Purple',       nameCn: '\u6D45\u7D2B\u8272',   hex: '#A478B8' },
  { brand: 'artkal', code: 'C-25', nameEn: 'Purple',             nameCn: '\u7D2B\u8272',     hex: '#7B2D8E' },
  { brand: 'artkal', code: 'C-26', nameEn: 'Dark Purple',        nameCn: '\u6DF1\u7D2B\u8272',   hex: '#5B1D6E' },
  { brand: 'artkal', code: 'C-27', nameEn: 'Plum',               nameCn: '\u6885\u7D2B\u8272',   hex: '#6E2570' },
  { brand: 'artkal', code: 'C-28', nameEn: 'Magenta',            nameCn: '\u6D0B\u7EA2\u8272',   hex: '#CC0066' },

  // === Blues ===
  { brand: 'artkal', code: 'C-29', nameEn: 'Light Blue',         nameCn: '\u6D45\u84DD\u8272',   hex: '#87CEEB' },
  { brand: 'artkal', code: 'C-30', nameEn: 'Sky Blue',           nameCn: '\u5929\u84DD\u8272',   hex: '#5DADEC' },
  { brand: 'artkal', code: 'C-31', nameEn: 'Blue',               nameCn: '\u84DD\u8272',     hex: '#2962FF' },
  { brand: 'artkal', code: 'C-32', nameEn: 'Royal Blue',         nameCn: '\u7687\u5BB6\u84DD',   hex: '#1A45AC' },
  { brand: 'artkal', code: 'C-33', nameEn: 'Dark Blue',          nameCn: '\u6DF1\u84DD\u8272',   hex: '#0D2B6B' },
  { brand: 'artkal', code: 'C-34', nameEn: 'Navy Blue',          nameCn: '\u6D77\u519B\u84DD',   hex: '#0A1F5C' },
  { brand: 'artkal', code: 'C-35', nameEn: 'Cyan',               nameCn: '\u9752\u8272',     hex: '#00BCD4' },
  { brand: 'artkal', code: 'C-36', nameEn: 'Turquoise',          nameCn: '\u7EFF\u677E\u77F3\u8272', hex: '#30D5C8' },
  { brand: 'artkal', code: 'C-37', nameEn: 'Powder Blue',        nameCn: '\u7C89\u84DD\u8272',   hex: '#B4D7E8' },

  // === Greens ===
  { brand: 'artkal', code: 'C-38', nameEn: 'Light Green',        nameCn: '\u6D45\u7EFF\u8272',   hex: '#90EE90' },
  { brand: 'artkal', code: 'C-39', nameEn: 'Lime Green',         nameCn: '\u67E0\u6AAC\u7EFF',   hex: '#7BC74D' },
  { brand: 'artkal', code: 'C-40', nameEn: 'Green',              nameCn: '\u7EFF\u8272',     hex: '#2E8B57' },
  { brand: 'artkal', code: 'C-41', nameEn: 'Dark Green',         nameCn: '\u6DF1\u7EFF\u8272',   hex: '#1B5E20' },
  { brand: 'artkal', code: 'C-42', nameEn: 'Forest Green',       nameCn: '\u68EE\u6797\u7EFF',   hex: '#228B22' },
  { brand: 'artkal', code: 'C-43', nameEn: 'Olive Green',        nameCn: '\u6A44\u6984\u7EFF',   hex: '#6B8E23' },
  { brand: 'artkal', code: 'C-44', nameEn: 'Mint Green',         nameCn: '\u8584\u8377\u7EFF',   hex: '#98FF98' },
  { brand: 'artkal', code: 'C-45', nameEn: 'Teal',               nameCn: '\u51CB\u7EFF\u8272',   hex: '#008080' },
  { brand: 'artkal', code: 'C-46', nameEn: 'Yellow Green',       nameCn: '\u9EC4\u7EFF\u8272',   hex: '#ADDF3C' },

  // === Browns ===
  { brand: 'artkal', code: 'C-47', nameEn: 'Light Brown',        nameCn: '\u6D45\u68D5\u8272',   hex: '#C8A96E' },
  { brand: 'artkal', code: 'C-48', nameEn: 'Brown',              nameCn: '\u68D5\u8272',     hex: '#8B5E3C' },
  { brand: 'artkal', code: 'C-49', nameEn: 'Dark Brown',         nameCn: '\u6DF1\u68D5\u8272',   hex: '#5C3317' },
  { brand: 'artkal', code: 'C-50', nameEn: 'Chocolate',          nameCn: '\u5DE7\u514B\u529B\u8272', hex: '#7B3F00' },
  { brand: 'artkal', code: 'C-51', nameEn: 'Tan',                nameCn: '\u68D5\u8910\u8272',   hex: '#D2B48C' },
  { brand: 'artkal', code: 'C-52', nameEn: 'Coffee',             nameCn: '\u5496\u5561\u8272',   hex: '#6F4E37' },

  // === Skin Tones ===
  { brand: 'artkal', code: 'C-53', nameEn: 'Light Skin',         nameCn: '\u6D45\u80A4\u8272',   hex: '#FFE0BD' },
  { brand: 'artkal', code: 'C-54', nameEn: 'Peach',              nameCn: '\u6843\u8089\u8272',   hex: '#FFDAB9' },
  { brand: 'artkal', code: 'C-55', nameEn: 'Skin',               nameCn: '\u80A4\u8272',     hex: '#E8B88A' },
  { brand: 'artkal', code: 'C-56', nameEn: 'Dark Skin',          nameCn: '\u6DF1\u80A4\u8272',   hex: '#C68E5B' },
  { brand: 'artkal', code: 'C-57', nameEn: 'Sand',               nameCn: '\u6C99\u8272',     hex: '#DFC5A0' },

  // === Grays ===
  { brand: 'artkal', code: 'C-58', nameEn: 'Light Gray',         nameCn: '\u6D45\u7070\u8272',   hex: '#D3D3D3' },
  { brand: 'artkal', code: 'C-59', nameEn: 'Gray',               nameCn: '\u7070\u8272',     hex: '#A0A0A0' },
  { brand: 'artkal', code: 'C-60', nameEn: 'Dark Gray',          nameCn: '\u6DF1\u7070\u8272',   hex: '#696969' },
  { brand: 'artkal', code: 'C-61', nameEn: 'Charcoal',           nameCn: '\u70AD\u7070\u8272',   hex: '#464646' },
  { brand: 'artkal', code: 'C-62', nameEn: 'Ash Gray',           nameCn: '\u706B\u5C71\u7070',   hex: '#B2BEB5' },

  // === Blacks ===
  { brand: 'artkal', code: 'C-63', nameEn: 'Black',              nameCn: '\u9ED1\u8272',     hex: '#1A1A1A' },
  { brand: 'artkal', code: 'C-64', nameEn: 'Jet Black',          nameCn: '\u4EAE\u9ED1\u8272',   hex: '#0A0A0A' },

  // === Special / Miscellaneous Colors ===
  { brand: 'artkal', code: 'C-65', nameEn: 'Coral',              nameCn: '\u73CA\u745A\u8272',   hex: '#FF7F50' },
  { brand: 'artkal', code: 'C-66', nameEn: 'Rust',               nameCn: '\u94C1\u9508\u7EA2',   hex: '#B7410E' },
  { brand: 'artkal', code: 'C-67', nameEn: 'Terracotta',         nameCn: '\u8D6B\u77F3\u8272',   hex: '#CC4E3C' },
  { brand: 'artkal', code: 'C-68', nameEn: 'Pastel Blue',        nameCn: '\u7C89\u5F69\u84DD',   hex: '#AEC6CF' },
  { brand: 'artkal', code: 'C-69', nameEn: 'Pastel Green',       nameCn: '\u7C89\u5F69\u7EFF',   hex: '#B2E6B2' },
  { brand: 'artkal', code: 'C-70', nameEn: 'Pastel Yellow',      nameCn: '\u7C89\u5F69\u9EC4',   hex: '#FFFACD' },
  { brand: 'artkal', code: 'C-71', nameEn: 'Pastel Pink',        nameCn: '\u7C89\u5F69\u7C89',   hex: '#FFD1DC' },
  { brand: 'artkal', code: 'C-72', nameEn: 'Pastel Purple',      nameCn: '\u7C89\u5F69\u7D2B',   hex: '#D8B4E2' },
  { brand: 'artkal', code: 'C-73', nameEn: 'Neon Green',         nameCn: '\u8367\u5149\u7EFF',   hex: '#39FF14' },
  { brand: 'artkal', code: 'C-74', nameEn: 'Neon Orange',        nameCn: '\u8367\u5149\u6A59',   hex: '#FF6600' },
  { brand: 'artkal', code: 'C-75', nameEn: 'Neon Pink',          nameCn: '\u8367\u5149\u7C89',   hex: '#FF10F0' },
  { brand: 'artkal', code: 'C-76', nameEn: 'Neon Yellow',        nameCn: '\u8367\u5149\u9EC4',   hex: '#DFFF00' },
  { brand: 'artkal', code: 'C-77', nameEn: 'Gold',               nameCn: '\u91D1\u8272',     hex: '#CFB53B' },
  { brand: 'artkal', code: 'C-78', nameEn: 'Silver',             nameCn: '\u94F6\u8272',     hex: '#C0C0C0' },
  { brand: 'artkal', code: 'C-79', nameEn: 'Khaki',              nameCn: '\u5361\u5176\u8272',   hex: '#BDB76B' },
  { brand: 'artkal', code: 'C-80', nameEn: 'Slate Blue',         nameCn: '\u77F3\u677F\u84DD',   hex: '#6A5ACD' },
];

/**
 * Artkal C-series colors with r, g, b values computed from hex.
 */
const artkalColors: BeadColor[] = rawColors.map(c => {
  const { r, g, b } = hexToRgb(c.hex);
  return { ...c, r, g, b };
});

/**
 * Complete Artkal C-series (2.6mm) bead palette.
 */
export const artkalPalette: Palette = {
  brand: 'artkal',
  brandCn: 'Artkal',
  beadSize: '2.6mm',
  colors: artkalColors,
};

export default artkalPalette;
