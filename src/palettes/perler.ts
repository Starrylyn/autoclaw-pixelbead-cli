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
 * Raw Perler standard bead color definitions.
 * Colors are based on the Perler Beads standard palette with realistic hex values.
 */
const rawColors: Omit<BeadColor, 'r' | 'g' | 'b'>[] = [
  // --- Whites, Creams, and Neutrals ---
  { brand: 'perler', code: 'P-01', nameEn: 'White', nameCn: '白色', hex: '#F4F4F4' },
  { brand: 'perler', code: 'P-02', nameEn: 'Cream', nameCn: '奶油色', hex: '#F5E6C8' },
  { brand: 'perler', code: 'P-03', nameEn: 'Ivory', nameCn: '象牙白', hex: '#F0EAD6' },

  // --- Yellows ---
  { brand: 'perler', code: 'P-04', nameEn: 'Yellow', nameCn: '黄色', hex: '#FFD500' },
  { brand: 'perler', code: 'P-05', nameEn: 'Pastel Yellow', nameCn: '淡黄色', hex: '#FFF4A3' },
  { brand: 'perler', code: 'P-06', nameEn: 'Cheddar', nameCn: '切达黄', hex: '#FFB81C' },
  { brand: 'perler', code: 'P-07', nameEn: 'Butterscotch', nameCn: '奶油糖色', hex: '#E39B3F' },

  // --- Oranges ---
  { brand: 'perler', code: 'P-08', nameEn: 'Orange', nameCn: '橙色', hex: '#FF6A13' },
  { brand: 'perler', code: 'P-09', nameEn: 'Hot Coral', nameCn: '热珊瑚色', hex: '#FF4040' },
  { brand: 'perler', code: 'P-10', nameEn: 'Tangerine', nameCn: '橘红色', hex: '#FF9933' },

  // --- Reds ---
  { brand: 'perler', code: 'P-11', nameEn: 'Red', nameCn: '红色', hex: '#D32027' },
  { brand: 'perler', code: 'P-12', nameEn: 'Cherry', nameCn: '樱桃红', hex: '#A51C30' },
  { brand: 'perler', code: 'P-13', nameEn: 'Raspberry', nameCn: '覆盆子红', hex: '#C4215A' },
  { brand: 'perler', code: 'P-14', nameEn: 'Rust', nameCn: '铁锈色', hex: '#A0522D' },

  // --- Pinks ---
  { brand: 'perler', code: 'P-15', nameEn: 'Pink', nameCn: '粉色', hex: '#F7A4B7' },
  { brand: 'perler', code: 'P-16', nameEn: 'Bubblegum', nameCn: '泡泡糖粉', hex: '#F9629F' },
  { brand: 'perler', code: 'P-17', nameEn: 'Magenta', nameCn: '品红色', hex: '#D6196B' },
  { brand: 'perler', code: 'P-18', nameEn: 'Flamingo', nameCn: '火烈鸟粉', hex: '#F8888B' },
  { brand: 'perler', code: 'P-19', nameEn: 'Pastel Pink', nameCn: '淡粉色', hex: '#FCCCD4' },
  { brand: 'perler', code: 'P-20', nameEn: 'Blush', nameCn: '腮红色', hex: '#E8A0A0' },

  // --- Purples ---
  { brand: 'perler', code: 'P-21', nameEn: 'Purple', nameCn: '紫色', hex: '#6B3FA0' },
  { brand: 'perler', code: 'P-22', nameEn: 'Plum', nameCn: '梅紫色', hex: '#7D3F6B' },
  { brand: 'perler', code: 'P-23', nameEn: 'Lavender', nameCn: '薰衣草紫', hex: '#B6A1C8' },
  { brand: 'perler', code: 'P-24', nameEn: 'Pastel Lavender', nameCn: '淡薰衣草紫', hex: '#D9C6E3' },
  { brand: 'perler', code: 'P-25', nameEn: 'Grape', nameCn: '葡萄紫', hex: '#5C2D82' },

  // --- Blues ---
  { brand: 'perler', code: 'P-26', nameEn: 'Dark Blue', nameCn: '深蓝色', hex: '#1B3A73' },
  { brand: 'perler', code: 'P-27', nameEn: 'Blue', nameCn: '蓝色', hex: '#2E5FAC' },
  { brand: 'perler', code: 'P-28', nameEn: 'Light Blue', nameCn: '浅蓝色', hex: '#7EC8E3' },
  { brand: 'perler', code: 'P-29', nameEn: 'Pastel Blue', nameCn: '淡蓝色', hex: '#C3E0F0' },
  { brand: 'perler', code: 'P-30', nameEn: 'Toothpaste', nameCn: '牙膏蓝', hex: '#78D1E1' },
  { brand: 'perler', code: 'P-31', nameEn: 'Cyan', nameCn: '青色', hex: '#00A5BD' },
  { brand: 'perler', code: 'P-32', nameEn: 'Robin Egg', nameCn: '知更鸟蛋蓝', hex: '#5EB5C9' },
  { brand: 'perler', code: 'P-33', nameEn: 'Cobalt', nameCn: '钴蓝色', hex: '#1338BE' },

  // --- Greens ---
  { brand: 'perler', code: 'P-34', nameEn: 'Dark Green', nameCn: '深绿色', hex: '#1B5E20' },
  { brand: 'perler', code: 'P-35', nameEn: 'Green', nameCn: '绿色', hex: '#30A548' },
  { brand: 'perler', code: 'P-36', nameEn: 'Bright Green', nameCn: '亮绿色', hex: '#4CBB17' },
  { brand: 'perler', code: 'P-37', nameEn: 'Lime', nameCn: '青柠绿', hex: '#A2C523' },
  { brand: 'perler', code: 'P-38', nameEn: 'Olive', nameCn: '橄榄绿', hex: '#6B702A' },
  { brand: 'perler', code: 'P-39', nameEn: 'Evergreen', nameCn: '常青绿', hex: '#2A5A28' },
  { brand: 'perler', code: 'P-40', nameEn: 'Shamrock', nameCn: '三叶草绿', hex: '#009B48' },
  { brand: 'perler', code: 'P-41', nameEn: 'Pastel Green', nameCn: '淡绿色', hex: '#B7E4C7' },
  { brand: 'perler', code: 'P-42', nameEn: 'Kiwi Lime', nameCn: '猕猴桃绿', hex: '#C5D63D' },

  // --- Browns ---
  { brand: 'perler', code: 'P-43', nameEn: 'Brown', nameCn: '棕色', hex: '#6D3B1E' },
  { brand: 'perler', code: 'P-44', nameEn: 'Dark Brown', nameCn: '深棕色', hex: '#3E2117' },
  { brand: 'perler', code: 'P-45', nameEn: 'Light Brown', nameCn: '浅棕色', hex: '#A67B5B' },
  { brand: 'perler', code: 'P-46', nameEn: 'Tan', nameCn: '棕褐色', hex: '#C4A56E' },
  { brand: 'perler', code: 'P-47', nameEn: 'Sand', nameCn: '沙色', hex: '#D8C3A5' },

  // --- Skin Tones ---
  { brand: 'perler', code: 'P-48', nameEn: 'Peach', nameCn: '桃肤色', hex: '#FFCBA4' },
  { brand: 'perler', code: 'P-49', nameEn: 'Skin', nameCn: '肤色', hex: '#E5B98A' },
  { brand: 'perler', code: 'P-50', nameEn: 'Fawn', nameCn: '浅褐肤色', hex: '#C8946A' },
  { brand: 'perler', code: 'P-51', nameEn: 'Cocoa', nameCn: '可可肤色', hex: '#7B4B2A' },
  { brand: 'perler', code: 'P-52', nameEn: 'Gingerbread', nameCn: '姜饼肤色', hex: '#9A5B2F' },

  // --- Grays and Blacks ---
  { brand: 'perler', code: 'P-53', nameEn: 'Light Gray', nameCn: '浅灰色', hex: '#C0C0C0' },
  { brand: 'perler', code: 'P-54', nameEn: 'Gray', nameCn: '灰色', hex: '#8E8E8E' },
  { brand: 'perler', code: 'P-55', nameEn: 'Charcoal', nameCn: '炭灰色', hex: '#5A5A5A' },
  { brand: 'perler', code: 'P-56', nameEn: 'Dark Gray', nameCn: '深灰色', hex: '#3D3D3D' },
  { brand: 'perler', code: 'P-57', nameEn: 'Black', nameCn: '黑色', hex: '#1A1A1A' },

  // --- Metallics and Special Colors ---
  { brand: 'perler', code: 'P-58', nameEn: 'Gold', nameCn: '金色', hex: '#D4AF37' },
  { brand: 'perler', code: 'P-59', nameEn: 'Silver', nameCn: '银色', hex: '#AAA9AD' },
  { brand: 'perler', code: 'P-60', nameEn: 'Bronze', nameCn: '青铜色', hex: '#CD7F32' },

  // --- Additional Pastels and Unique Colors ---
  { brand: 'perler', code: 'P-61', nameEn: 'Periwinkle', nameCn: '长春花蓝', hex: '#7B7FC0' },
  { brand: 'perler', code: 'P-62', nameEn: 'Turquoise', nameCn: '绿松石色', hex: '#20B2AA' },
  { brand: 'perler', code: 'P-63', nameEn: 'Teal', nameCn: '蓝绿色', hex: '#007E7A' },
  { brand: 'perler', code: 'P-64', nameEn: 'Honey', nameCn: '蜂蜜色', hex: '#E8A317' },
  { brand: 'perler', code: 'P-65', nameEn: 'Prickly Pear', nameCn: '仙人掌果色', hex: '#DA4167' },
];

/**
 * Perler standard bead colors with computed RGB values.
 */
const perlerColors: BeadColor[] = rawColors.map(c => {
  const { r, g, b } = hexToRgb(c.hex);
  return { ...c, r, g, b };
});

/**
 * Perler standard 5mm bead palette.
 */
export const perlerPalette: Palette = {
  brand: 'perler',
  brandCn: 'Perler',
  beadSize: '5mm',
  colors: perlerColors,
};
