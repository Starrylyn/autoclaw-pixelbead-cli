// Color palette types
export interface BeadColor {
  brand: string;
  code: string;
  nameEn: string;
  nameCn: string;
  hex: string;
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  brand: string;
  brandCn: string;
  beadSize: string;
  colors: BeadColor[];
}

export type BrandName = 'artkal' | 'hama' | 'perler' | 'mard' | 'coco';
