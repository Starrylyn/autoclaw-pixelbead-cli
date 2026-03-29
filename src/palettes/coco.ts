import { BeadColor, Palette } from './types';

/**
 * COCO (可可) bead color palette
 * A popular Chinese domestic bead brand with a comprehensive color selection.
 * Bead size: 2.6mm mini beads
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace(/^#/, '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return { r, g, b };
}

const rawColors: Omit<BeadColor, 'r' | 'g' | 'b'>[] = [
  // === Whites & Creams ===
  { brand: 'coco', code: 'K-01', nameEn: 'White', nameCn: '白色', hex: '#FEFEFE' },
  { brand: 'coco', code: 'K-02', nameEn: 'Cream White', nameCn: '奶白', hex: '#F8ECD8' },
  { brand: 'coco', code: 'K-03', nameEn: 'Ivory', nameCn: '象牙白', hex: '#FAEFD2' },
  { brand: 'coco', code: 'K-04', nameEn: 'Snow White', nameCn: '雪白', hex: '#F9F6F0' },

  // === Blacks & Grays ===
  { brand: 'coco', code: 'K-05', nameEn: 'Black', nameCn: '黑色', hex: '#1C1C1C' },
  { brand: 'coco', code: 'K-06', nameEn: 'Dark Gray', nameCn: '深灰', hex: '#505050' },
  { brand: 'coco', code: 'K-07', nameEn: 'Medium Gray', nameCn: '中灰', hex: '#7E7E7E' },
  { brand: 'coco', code: 'K-08', nameEn: 'Light Gray', nameCn: '浅灰', hex: '#BEBEBE' },
  { brand: 'coco', code: 'K-09', nameEn: 'Ash Gray', nameCn: '烟灰', hex: '#9A9A9A' },

  // === Reds ===
  { brand: 'coco', code: 'K-10', nameEn: 'Red', nameCn: '红色', hex: '#E20A15' },
  { brand: 'coco', code: 'K-11', nameEn: 'Dark Red', nameCn: '暗红', hex: '#880808' },
  { brand: 'coco', code: 'K-12', nameEn: 'Crimson', nameCn: '绛红', hex: '#AF1E2D' },
  { brand: 'coco', code: 'K-13', nameEn: 'Vermilion', nameCn: '朱红', hex: '#E04030' },
  { brand: 'coco', code: 'K-14', nameEn: 'Wine Red', nameCn: '酒红', hex: '#6E2C3A' },

  // === Oranges ===
  { brand: 'coco', code: 'K-15', nameEn: 'Orange', nameCn: '橙色', hex: '#FF8800' },
  { brand: 'coco', code: 'K-16', nameEn: 'Orange Red', nameCn: '橘红', hex: '#FF4010' },
  { brand: 'coco', code: 'K-17', nameEn: 'Apricot', nameCn: '杏色', hex: '#F7C5A0' },
  { brand: 'coco', code: 'K-18', nameEn: 'Tangerine', nameCn: '橘黄', hex: '#FFA020' },

  // === Yellows ===
  { brand: 'coco', code: 'K-19', nameEn: 'Yellow', nameCn: '黄色', hex: '#FFD200' },
  { brand: 'coco', code: 'K-20', nameEn: 'Lemon Yellow', nameCn: '柠檬黄', hex: '#FFF033' },
  { brand: 'coco', code: 'K-21', nameEn: 'Light Yellow', nameCn: '浅黄', hex: '#FFFDD0' },
  { brand: 'coco', code: 'K-22', nameEn: 'Golden Yellow', nameCn: '金黄', hex: '#FFAE00' },
  { brand: 'coco', code: 'K-23', nameEn: 'Mustard Yellow', nameCn: '芥末黄', hex: '#D4A017' },

  // === Greens ===
  { brand: 'coco', code: 'K-24', nameEn: 'Green', nameCn: '绿色', hex: '#00A34E' },
  { brand: 'coco', code: 'K-25', nameEn: 'Grass Green', nameCn: '草绿', hex: '#76D72D' },
  { brand: 'coco', code: 'K-26', nameEn: 'Dark Green', nameCn: '深绿', hex: '#005E20' },
  { brand: 'coco', code: 'K-27', nameEn: 'Mint Green', nameCn: '薄荷绿', hex: '#90EE90' },
  { brand: 'coco', code: 'K-28', nameEn: 'Olive Green', nameCn: '橄榄绿', hex: '#4F6228' },
  { brand: 'coco', code: 'K-29', nameEn: 'Emerald', nameCn: '翡翠绿', hex: '#009060' },
  { brand: 'coco', code: 'K-30', nameEn: 'Teal Green', nameCn: '蓝绿', hex: '#008080' },

  // === Blues ===
  { brand: 'coco', code: 'K-31', nameEn: 'Blue', nameCn: '蓝色', hex: '#0060C0' },
  { brand: 'coco', code: 'K-32', nameEn: 'Sky Blue', nameCn: '天蓝', hex: '#82CAE2' },
  { brand: 'coco', code: 'K-33', nameEn: 'Dark Blue', nameCn: '深蓝', hex: '#002E5D' },
  { brand: 'coco', code: 'K-34', nameEn: 'Royal Blue', nameCn: '宝蓝', hex: '#3D5FCC' },
  { brand: 'coco', code: 'K-35', nameEn: 'Navy Blue', nameCn: '藏蓝', hex: '#002050' },
  { brand: 'coco', code: 'K-36', nameEn: 'Light Blue', nameCn: '浅蓝', hex: '#A3D1E6' },
  { brand: 'coco', code: 'K-37', nameEn: 'Cyan', nameCn: '青色', hex: '#00C5CD' },

  // === Purples ===
  { brand: 'coco', code: 'K-38', nameEn: 'Purple', nameCn: '紫色', hex: '#7D0075' },
  { brand: 'coco', code: 'K-39', nameEn: 'Lavender', nameCn: '薰衣草紫', hex: '#AB7CC5' },
  { brand: 'coco', code: 'K-40', nameEn: 'Dark Purple', nameCn: '深紫', hex: '#440066' },
  { brand: 'coco', code: 'K-41', nameEn: 'Violet', nameCn: '堇紫', hex: '#7C00E0' },
  { brand: 'coco', code: 'K-42', nameEn: 'Lilac', nameCn: '丁香紫', hex: '#C5A3C9' },

  // === Pinks ===
  { brand: 'coco', code: 'K-43', nameEn: 'Pink', nameCn: '粉色', hex: '#FFB0BC' },
  { brand: 'coco', code: 'K-44', nameEn: 'Rose Red', nameCn: '玫红', hex: '#E00068' },
  { brand: 'coco', code: 'K-45', nameEn: 'Hot Pink', nameCn: '亮粉', hex: '#FF5DAA' },
  { brand: 'coco', code: 'K-46', nameEn: 'Peach Pink', nameCn: '桃粉', hex: '#FFC4A8' },
  { brand: 'coco', code: 'K-47', nameEn: 'Coral Pink', nameCn: '珊瑚粉', hex: '#F58070' },
  { brand: 'coco', code: 'K-48', nameEn: 'Cherry Blossom', nameCn: '樱花粉', hex: '#FFB2C0' },

  // === Browns ===
  { brand: 'coco', code: 'K-49', nameEn: 'Brown', nameCn: '棕色', hex: '#8B4720' },
  { brand: 'coco', code: 'K-50', nameEn: 'Dark Brown', nameCn: '深棕', hex: '#5A3010' },
  { brand: 'coco', code: 'K-51', nameEn: 'Light Brown', nameCn: '浅棕', hex: '#C2A57E' },
  { brand: 'coco', code: 'K-52', nameEn: 'Chocolate', nameCn: '巧克力', hex: '#7A3B10' },
  { brand: 'coco', code: 'K-53', nameEn: 'Coffee', nameCn: '咖啡色', hex: '#6D4C30' },

  // === Skin Tones ===
  { brand: 'coco', code: 'K-54', nameEn: 'Light Skin', nameCn: '浅肤色', hex: '#FFDDB8' },
  { brand: 'coco', code: 'K-55', nameEn: 'Skin', nameCn: '肤色', hex: '#F2C098' },
  { brand: 'coco', code: 'K-56', nameEn: 'Dark Skin', nameCn: '深肤色', hex: '#CE9060' },
  { brand: 'coco', code: 'K-57', nameEn: 'Tan', nameCn: '小麦色', hex: '#C09068' },

  // === Pastels ===
  { brand: 'coco', code: 'K-58', nameEn: 'Pastel Pink', nameCn: '粉彩粉', hex: '#FFCDD5' },
  { brand: 'coco', code: 'K-59', nameEn: 'Pastel Blue', nameCn: '粉彩蓝', hex: '#A8C0CF' },
  { brand: 'coco', code: 'K-60', nameEn: 'Pastel Green', nameCn: '粉彩绿', hex: '#AEE2AE' },
  { brand: 'coco', code: 'K-61', nameEn: 'Pastel Yellow', nameCn: '粉彩黄', hex: '#FAFA90' },
  { brand: 'coco', code: 'K-62', nameEn: 'Pastel Purple', nameCn: '粉彩紫', hex: '#D4A8D4' },

  // === Special / Fluorescent ===
  { brand: 'coco', code: 'K-63', nameEn: 'Fluorescent Green', nameCn: '荧光绿', hex: '#33FF10' },
  { brand: 'coco', code: 'K-64', nameEn: 'Fluorescent Pink', nameCn: '荧光粉', hex: '#FF60C0' },
  { brand: 'coco', code: 'K-65', nameEn: 'Fluorescent Orange', nameCn: '荧光橙', hex: '#FF5500' },
  { brand: 'coco', code: 'K-66', nameEn: 'Fluorescent Yellow', nameCn: '荧光黄', hex: '#C8FF00' },
  { brand: 'coco', code: 'K-67', nameEn: 'Transparent', nameCn: '透明', hex: '#EEEEEE' },
  { brand: 'coco', code: 'K-68', nameEn: 'Glow in Dark', nameCn: '夜光', hex: '#E5F2E5' },
];

const cocoColors: BeadColor[] = rawColors.map((color) => {
  const { r, g, b } = hexToRgb(color.hex);
  return { ...color, r, g, b };
});

export const cocoPalette: Palette = {
  brand: 'coco',
  brandCn: '可可',
  beadSize: '2.6mm',
  colors: cocoColors,
};
