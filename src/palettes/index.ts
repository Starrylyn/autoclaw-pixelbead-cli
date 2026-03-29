import { Palette, BrandName } from './types';
import { artkalPalette } from './artkal';
import { hamaPalette } from './hama';
import { perlerPalette } from './perler';
import { mardPalette } from './mard';
import { cocoPalette } from './coco';

export { Palette, BrandName, BeadColor } from './types';

const palettes: Record<BrandName, Palette> = {
  artkal: artkalPalette,
  hama: hamaPalette,
  perler: perlerPalette,
  mard: mardPalette,
  coco: cocoPalette,
};

export function getPalette(brand: BrandName): Palette {
  const p = palettes[brand];
  if (!p) {
    throw new Error(`Unknown brand: ${brand}. Available: ${Object.keys(palettes).join(', ')}`);
  }
  return p;
}

export function getAllBrands(): BrandName[] {
  return Object.keys(palettes) as BrandName[];
}

export function getPaletteByName(name: string): Palette {
  const normalized = name.toLowerCase().trim() as BrandName;
  return getPalette(normalized);
}

export default palettes;
