import { BeadColor, Palette } from './types';

/**
 * Parse a hex color string into its RGB components.
 * Supports both '#RRGGBB' and 'RRGGBB' formats.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, '');
  const value = parseInt(cleaned, 16);
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  };
}

/**
 * Raw Hama Midi bead color definitions.
 * These are the standard Hama Midi (5mm) bead colors with realistic hex values.
 */
const rawColors: Omit<BeadColor, 'r' | 'g' | 'b'>[] = [
  // --- Whites, Creams, Grays, Blacks ---
  { brand: 'hama', code: 'H-01', nameEn: 'White', nameCn: '白色', hex: '#FFFFFF' },
  { brand: 'hama', code: 'H-02', nameEn: 'Cream', nameCn: '奶油色', hex: '#F5E6C8' },
  { brand: 'hama', code: 'H-70', nameEn: 'Light Gray', nameCn: '浅灰色', hex: '#C4C4C4' },
  { brand: 'hama', code: 'H-17', nameEn: 'Gray', nameCn: '灰色', hex: '#8E8E8E' },
  { brand: 'hama', code: 'H-71', nameEn: 'Dark Gray', nameCn: '深灰色', hex: '#5B5B5B' },
  { brand: 'hama', code: 'H-18', nameEn: 'Black', nameCn: '黑色', hex: '#1A1A1A' },

  // --- Reds ---
  { brand: 'hama', code: 'H-05', nameEn: 'Red', nameCn: '红色', hex: '#CC0000' },
  { brand: 'hama', code: 'H-22', nameEn: 'Dark Red', nameCn: '深红色', hex: '#8B0000' },
  { brand: 'hama', code: 'H-13', nameEn: 'Transparent Red', nameCn: '透明红色', hex: '#E60000' },
  { brand: 'hama', code: 'H-35', nameEn: 'Neon Red', nameCn: '荧光红色', hex: '#FF2244' },
  { brand: 'hama', code: 'H-44', nameEn: 'Pastel Red', nameCn: '淡红色', hex: '#F28C8C' },

  // --- Oranges ---
  { brand: 'hama', code: 'H-04', nameEn: 'Orange', nameCn: '橙色', hex: '#FF6600' },
  { brand: 'hama', code: 'H-38', nameEn: 'Neon Orange', nameCn: '荧光橙色', hex: '#FF5522' },
  { brand: 'hama', code: 'H-79', nameEn: 'Tan', nameCn: '棕褐色', hex: '#D2A060' },

  // --- Yellows ---
  { brand: 'hama', code: 'H-03', nameEn: 'Yellow', nameCn: '黄色', hex: '#FFE600' },
  { brand: 'hama', code: 'H-14', nameEn: 'Transparent Yellow', nameCn: '透明黄色', hex: '#FFF000' },
  { brand: 'hama', code: 'H-34', nameEn: 'Neon Yellow', nameCn: '荧光黄色', hex: '#E8FF00' },
  { brand: 'hama', code: 'H-43', nameEn: 'Pastel Yellow', nameCn: '淡黄色', hex: '#FFF5A0' },
  { brand: 'hama', code: 'H-60', nameEn: 'Teddy Bear Brown', nameCn: '泰迪熊棕色', hex: '#C89640' },

  // --- Greens ---
  { brand: 'hama', code: 'H-10', nameEn: 'Green', nameCn: '绿色', hex: '#009933' },
  { brand: 'hama', code: 'H-11', nameEn: 'Light Green', nameCn: '浅绿色', hex: '#66CC33' },
  { brand: 'hama', code: 'H-28', nameEn: 'Dark Green', nameCn: '深绿色', hex: '#005C29' },
  { brand: 'hama', code: 'H-47', nameEn: 'Pastel Green', nameCn: '淡绿色', hex: '#A8E6A0' },
  { brand: 'hama', code: 'H-37', nameEn: 'Neon Green', nameCn: '荧光绿色', hex: '#44FF00' },
  { brand: 'hama', code: 'H-16', nameEn: 'Transparent Green', nameCn: '透明绿色', hex: '#33CC66' },
  { brand: 'hama', code: 'H-84', nameEn: 'Olive', nameCn: '橄榄色', hex: '#808000' },
  { brand: 'hama', code: 'H-102', nameEn: 'Forest Green', nameCn: '森林绿色', hex: '#2B6E2B' },

  // --- Blues ---
  { brand: 'hama', code: 'H-08', nameEn: 'Blue', nameCn: '蓝色', hex: '#0033CC' },
  { brand: 'hama', code: 'H-09', nameEn: 'Light Blue', nameCn: '浅蓝色', hex: '#66CCFF' },
  { brand: 'hama', code: 'H-15', nameEn: 'Transparent Blue', nameCn: '透明蓝色', hex: '#3399FF' },
  { brand: 'hama', code: 'H-36', nameEn: 'Neon Blue', nameCn: '荧光蓝色', hex: '#0088FF' },
  { brand: 'hama', code: 'H-46', nameEn: 'Pastel Blue', nameCn: '淡蓝色', hex: '#A0C8F0' },
  { brand: 'hama', code: 'H-48', nameEn: 'Pastel Dark Blue', nameCn: '淡深蓝色', hex: '#7090C0' },
  { brand: 'hama', code: 'H-63', nameEn: 'Dark Blue', nameCn: '深蓝色', hex: '#001A66' },
  { brand: 'hama', code: 'H-73', nameEn: 'Azure', nameCn: '天蓝色', hex: '#0080C0' },

  // --- Purples & Violets ---
  { brand: 'hama', code: 'H-07', nameEn: 'Purple', nameCn: '紫色', hex: '#660099' },
  { brand: 'hama', code: 'H-24', nameEn: 'Plum', nameCn: '梅红色', hex: '#993366' },
  { brand: 'hama', code: 'H-45', nameEn: 'Pastel Purple', nameCn: '淡紫色', hex: '#D1A0E0' },
  { brand: 'hama', code: 'H-74', nameEn: 'Dark Purple', nameCn: '深紫色', hex: '#440066' },

  // --- Pinks ---
  { brand: 'hama', code: 'H-06', nameEn: 'Pink', nameCn: '粉色', hex: '#FF99CC' },
  { brand: 'hama', code: 'H-69', nameEn: 'Pastel Pink', nameCn: '淡粉色', hex: '#FFB8D0' },
  { brand: 'hama', code: 'H-72', nameEn: 'Dark Pink', nameCn: '深粉色', hex: '#E05080' },
  { brand: 'hama', code: 'H-33', nameEn: 'Neon Pink', nameCn: '荧光粉色', hex: '#FF3399' },
  { brand: 'hama', code: 'H-85', nameEn: 'Magenta', nameCn: '洋红色', hex: '#CC0066' },

  // --- Browns ---
  { brand: 'hama', code: 'H-20', nameEn: 'Brown', nameCn: '棕色', hex: '#8B4513' },
  { brand: 'hama', code: 'H-12', nameEn: 'Light Brown', nameCn: '浅棕色', hex: '#C4883C' },
  { brand: 'hama', code: 'H-30', nameEn: 'Dark Brown', nameCn: '深棕色', hex: '#4A2800' },

  // --- Skin Tones ---
  { brand: 'hama', code: 'H-26', nameEn: 'Flesh', nameCn: '肤色', hex: '#F5C8A8' },
  { brand: 'hama', code: 'H-56', nameEn: 'Skin Tan', nameCn: '蜜桃肤色', hex: '#E0A878' },
  { brand: 'hama', code: 'H-78', nameEn: 'Light Skin', nameCn: '浅肤色', hex: '#FFE0C0' },
  { brand: 'hama', code: 'H-58', nameEn: 'Dark Skin', nameCn: '深肤色', hex: '#A06030' },

  // --- Pastels (additional) ---
  { brand: 'hama', code: 'H-95', nameEn: 'Pastel Lilac', nameCn: '淡丁香色', hex: '#C8A8E8' },
  { brand: 'hama', code: 'H-96', nameEn: 'Pastel Mint', nameCn: '淡薄荷色', hex: '#B0F0D0' },
  { brand: 'hama', code: 'H-97', nameEn: 'Pastel Coral', nameCn: '淡珊瑚色', hex: '#FFB0A0' },
  { brand: 'hama', code: 'H-98', nameEn: 'Pastel Peach', nameCn: '淡桃色', hex: '#FFD8B8' },

  // --- Fluorescent & Specialty ---
  { brand: 'hama', code: 'H-39', nameEn: 'Neon Lime', nameCn: '荧光青柠色', hex: '#CCFF00' },
  { brand: 'hama', code: 'H-42', nameEn: 'Fluorescent Orange', nameCn: '荧光亮橙色', hex: '#FF8800' },

  // --- Transparent ---
  { brand: 'hama', code: 'H-19', nameEn: 'Transparent', nameCn: '透明', hex: '#F0F0F0' },
  { brand: 'hama', code: 'H-53', nameEn: 'Transparent Purple', nameCn: '透明紫色', hex: '#9933CC' },
  { brand: 'hama', code: 'H-54', nameEn: 'Transparent Dark Blue', nameCn: '透明深蓝色', hex: '#2244AA' },

  // --- Glow & Metallic ---
  { brand: 'hama', code: 'H-55', nameEn: 'Glow in the Dark', nameCn: '夜光色', hex: '#E8FFD0' },
  { brand: 'hama', code: 'H-61', nameEn: 'Gold', nameCn: '金色', hex: '#D4A830' },
  { brand: 'hama', code: 'H-62', nameEn: 'Silver', nameCn: '银色', hex: '#C0C0C0' },
  { brand: 'hama', code: 'H-64', nameEn: 'Bronze', nameCn: '青铜色', hex: '#B08040' },
];

/**
 * Map raw color definitions to full BeadColor objects with parsed RGB values.
 */
const hamaColors: BeadColor[] = rawColors.map(c => {
  const { r, g, b } = hexToRgb(c.hex);
  return { ...c, r, g, b };
});

/**
 * Hama Midi (5mm) bead color palette.
 */
export const hamaPalette: Palette = {
  brand: 'hama',
  brandCn: 'Hama',
  beadSize: '5mm',
  colors: hamaColors,
};
