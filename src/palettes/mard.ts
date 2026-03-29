import { BeadColor, Palette } from './types';

/**
 * MARD (咪小窝) bead color palette
 * A popular Chinese domestic bead brand known for a wide range of vibrant colors.
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
  { brand: 'mard', code: 'M-01', nameEn: 'White', nameCn: '白色', hex: '#FFFFFF' },
  { brand: 'mard', code: 'M-02', nameEn: 'Cream White', nameCn: '奶白', hex: '#FAF0E6' },
  { brand: 'mard', code: 'M-03', nameEn: 'Ivory', nameCn: '象牙白', hex: '#FFFFF0' },
  { brand: 'mard', code: 'M-04', nameEn: 'Pearl White', nameCn: '珍珠白', hex: '#F5F5F0' },

  // === Blacks & Grays ===
  { brand: 'mard', code: 'M-05', nameEn: 'Black', nameCn: '黑色', hex: '#1A1A1A' },
  { brand: 'mard', code: 'M-06', nameEn: 'Dark Gray', nameCn: '深灰', hex: '#4A4A4A' },
  { brand: 'mard', code: 'M-07', nameEn: 'Medium Gray', nameCn: '中灰', hex: '#808080' },
  { brand: 'mard', code: 'M-08', nameEn: 'Light Gray', nameCn: '浅灰', hex: '#C0C0C0' },
  { brand: 'mard', code: 'M-09', nameEn: 'Silver Gray', nameCn: '银灰', hex: '#A8A8A8' },

  // === Reds ===
  { brand: 'mard', code: 'M-10', nameEn: 'Red', nameCn: '红色', hex: '#E60012' },
  { brand: 'mard', code: 'M-11', nameEn: 'Dark Red', nameCn: '暗红', hex: '#8B0000' },
  { brand: 'mard', code: 'M-12', nameEn: 'Crimson', nameCn: '绛红', hex: '#B22222' },
  { brand: 'mard', code: 'M-13', nameEn: 'Vermilion', nameCn: '朱红', hex: '#E34234' },
  { brand: 'mard', code: 'M-14', nameEn: 'Wine Red', nameCn: '酒红', hex: '#722F37' },

  // === Oranges ===
  { brand: 'mard', code: 'M-15', nameEn: 'Orange', nameCn: '橙色', hex: '#FF8C00' },
  { brand: 'mard', code: 'M-16', nameEn: 'Orange Red', nameCn: '橘红', hex: '#FF4500' },
  { brand: 'mard', code: 'M-17', nameEn: 'Apricot', nameCn: '杏色', hex: '#FBCEB1' },
  { brand: 'mard', code: 'M-18', nameEn: 'Tangerine', nameCn: '橘黄', hex: '#FF9F00' },

  // === Yellows ===
  { brand: 'mard', code: 'M-19', nameEn: 'Yellow', nameCn: '黄色', hex: '#FFD700' },
  { brand: 'mard', code: 'M-20', nameEn: 'Lemon Yellow', nameCn: '柠檬黄', hex: '#FFF44F' },
  { brand: 'mard', code: 'M-21', nameEn: 'Light Yellow', nameCn: '浅黄', hex: '#FFFFE0' },
  { brand: 'mard', code: 'M-22', nameEn: 'Golden Yellow', nameCn: '金黄', hex: '#FFB800' },
  { brand: 'mard', code: 'M-23', nameEn: 'Mustard Yellow', nameCn: '芥末黄', hex: '#E1AD01' },

  // === Greens ===
  { brand: 'mard', code: 'M-24', nameEn: 'Green', nameCn: '绿色', hex: '#00A550' },
  { brand: 'mard', code: 'M-25', nameEn: 'Grass Green', nameCn: '草绿', hex: '#7CFC00' },
  { brand: 'mard', code: 'M-26', nameEn: 'Dark Green', nameCn: '深绿', hex: '#006400' },
  { brand: 'mard', code: 'M-27', nameEn: 'Mint Green', nameCn: '薄荷绿', hex: '#98FB98' },
  { brand: 'mard', code: 'M-28', nameEn: 'Olive Green', nameCn: '橄榄绿', hex: '#556B2F' },
  { brand: 'mard', code: 'M-29', nameEn: 'Emerald', nameCn: '翡翠绿', hex: '#009B6D' },
  { brand: 'mard', code: 'M-30', nameEn: 'Sage Green', nameCn: '灰绿', hex: '#87AE73' },

  // === Blues ===
  { brand: 'mard', code: 'M-31', nameEn: 'Blue', nameCn: '蓝色', hex: '#0066CC' },
  { brand: 'mard', code: 'M-32', nameEn: 'Sky Blue', nameCn: '天蓝', hex: '#87CEEB' },
  { brand: 'mard', code: 'M-33', nameEn: 'Dark Blue', nameCn: '深蓝', hex: '#003366' },
  { brand: 'mard', code: 'M-34', nameEn: 'Royal Blue', nameCn: '宝蓝', hex: '#4169E1' },
  { brand: 'mard', code: 'M-35', nameEn: 'Navy Blue', nameCn: '藏蓝', hex: '#001F5B' },
  { brand: 'mard', code: 'M-36', nameEn: 'Light Blue', nameCn: '浅蓝', hex: '#ADD8E6' },
  { brand: 'mard', code: 'M-37', nameEn: 'Cyan', nameCn: '青色', hex: '#00CED1' },

  // === Purples ===
  { brand: 'mard', code: 'M-38', nameEn: 'Purple', nameCn: '紫色', hex: '#800080' },
  { brand: 'mard', code: 'M-39', nameEn: 'Lavender', nameCn: '薰衣草紫', hex: '#B57EDC' },
  { brand: 'mard', code: 'M-40', nameEn: 'Dark Purple', nameCn: '深紫', hex: '#4B0082' },
  { brand: 'mard', code: 'M-41', nameEn: 'Violet', nameCn: '堇紫', hex: '#7F00FF' },
  { brand: 'mard', code: 'M-42', nameEn: 'Lilac', nameCn: '丁香紫', hex: '#C8A2C8' },

  // === Pinks ===
  { brand: 'mard', code: 'M-43', nameEn: 'Pink', nameCn: '粉色', hex: '#FFB6C1' },
  { brand: 'mard', code: 'M-44', nameEn: 'Rose Red', nameCn: '玫红', hex: '#E60073' },
  { brand: 'mard', code: 'M-45', nameEn: 'Hot Pink', nameCn: '亮粉', hex: '#FF69B4' },
  { brand: 'mard', code: 'M-46', nameEn: 'Peach Pink', nameCn: '桃粉', hex: '#FFCBA4' },
  { brand: 'mard', code: 'M-47', nameEn: 'Coral Pink', nameCn: '珊瑚粉', hex: '#F88379' },
  { brand: 'mard', code: 'M-48', nameEn: 'Cherry Blossom', nameCn: '樱花粉', hex: '#FFB7C5' },

  // === Browns ===
  { brand: 'mard', code: 'M-49', nameEn: 'Brown', nameCn: '棕色', hex: '#8B4513' },
  { brand: 'mard', code: 'M-50', nameEn: 'Dark Brown', nameCn: '深棕', hex: '#5C3317' },
  { brand: 'mard', code: 'M-51', nameEn: 'Light Brown', nameCn: '浅棕', hex: '#C4A882' },
  { brand: 'mard', code: 'M-52', nameEn: 'Chocolate', nameCn: '巧克力', hex: '#7B3F00' },
  { brand: 'mard', code: 'M-53', nameEn: 'Coffee', nameCn: '咖啡色', hex: '#6F4E37' },

  // === Skin Tones ===
  { brand: 'mard', code: 'M-54', nameEn: 'Light Skin', nameCn: '浅肤色', hex: '#FFE0BD' },
  { brand: 'mard', code: 'M-55', nameEn: 'Skin', nameCn: '肤色', hex: '#F5C5A3' },
  { brand: 'mard', code: 'M-56', nameEn: 'Dark Skin', nameCn: '深肤色', hex: '#D2956A' },
  { brand: 'mard', code: 'M-57', nameEn: 'Tan', nameCn: '小麦色', hex: '#C6956E' },

  // === Pastels ===
  { brand: 'mard', code: 'M-58', nameEn: 'Pastel Pink', nameCn: '粉彩粉', hex: '#FFD1DC' },
  { brand: 'mard', code: 'M-59', nameEn: 'Pastel Blue', nameCn: '粉彩蓝', hex: '#AEC6CF' },
  { brand: 'mard', code: 'M-60', nameEn: 'Pastel Green', nameCn: '粉彩绿', hex: '#B2E6B2' },
  { brand: 'mard', code: 'M-61', nameEn: 'Pastel Yellow', nameCn: '粉彩黄', hex: '#FDFD96' },
  { brand: 'mard', code: 'M-62', nameEn: 'Pastel Purple', nameCn: '粉彩紫', hex: '#D8B2D8' },

  // === Special / Fluorescent ===
  { brand: 'mard', code: 'M-63', nameEn: 'Fluorescent Green', nameCn: '荧光绿', hex: '#39FF14' },
  { brand: 'mard', code: 'M-64', nameEn: 'Fluorescent Pink', nameCn: '荧光粉', hex: '#FF6EC7' },
  { brand: 'mard', code: 'M-65', nameEn: 'Fluorescent Orange', nameCn: '荧光橙', hex: '#FF5F15' },
  { brand: 'mard', code: 'M-66', nameEn: 'Fluorescent Yellow', nameCn: '荧光黄', hex: '#CCFF00' },
  { brand: 'mard', code: 'M-67', nameEn: 'Transparent', nameCn: '透明', hex: '#F0F0F0' },
  { brand: 'mard', code: 'M-68', nameEn: 'Glow in Dark', nameCn: '夜光', hex: '#E8F5E9' },
];

const mardColors: BeadColor[] = rawColors.map((color) => {
  const { r, g, b } = hexToRgb(color.hex);
  return { ...color, r, g, b };
});

export const mardPalette: Palette = {
  brand: 'mard',
  brandCn: '咪小窝',
  beadSize: '2.6mm',
  colors: mardColors,
};
