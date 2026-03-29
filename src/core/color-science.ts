/**
 * Color space conversion and perceptual color distance calculation.
 *
 * Implements sRGB <-> CIELAB conversion (via XYZ, D65 illuminant) and the
 * CIEDE2000 color-difference formula (Sharma, Wu, Dalal 2005).
 *
 * Pure math — no external dependencies.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Lab {
  L: number;
  a: number;
  b: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// D65 reference white (CIE 1931 2-degree observer)
const REF_X = 95.047;
const REF_Y = 100.0;
const REF_Z = 108.883;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// CIE XYZ ↔ Lab threshold
const EPSILON = 0.008856; // (6/29)^3
const KAPPA = 903.3; // (29/6)^3  ≈ 7.787 * 116

// ---------------------------------------------------------------------------
// sRGB → CIELAB (via XYZ)
// ---------------------------------------------------------------------------

/**
 * Convert an sRGB value (0-255 per channel) to CIELAB using the D65
 * illuminant as reference white.
 */
export function rgbToLab(r: number, g: number, b: number): Lab {
  // 1. Linearize sRGB (gamma expansion)
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  rr = rr > 0.04045 ? Math.pow((rr + 0.055) / 1.055, 2.4) : rr / 12.92;
  gg = gg > 0.04045 ? Math.pow((gg + 0.055) / 1.055, 2.4) : gg / 12.92;
  bb = bb > 0.04045 ? Math.pow((bb + 0.055) / 1.055, 2.4) : bb / 12.92;

  // Scale to 0-100 range for XYZ
  rr *= 100;
  gg *= 100;
  bb *= 100;

  // 2. Linear RGB → CIE XYZ (sRGB matrix, D65)
  const x = rr * 0.4124564 + gg * 0.3575761 + bb * 0.1804375;
  const y = rr * 0.2126729 + gg * 0.7151522 + bb * 0.0721750;
  const z = rr * 0.0193339 + gg * 0.1191920 + bb * 0.9503041;

  // 3. XYZ → Lab
  let fx = x / REF_X;
  let fy = y / REF_Y;
  let fz = z / REF_Z;

  fx = fx > EPSILON ? Math.cbrt(fx) : (KAPPA * fx + 16) / 116;
  fy = fy > EPSILON ? Math.cbrt(fy) : (KAPPA * fy + 16) / 116;
  fz = fz > EPSILON ? Math.cbrt(fz) : (KAPPA * fz + 16) / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bStar = 200 * (fy - fz);

  return { L, a, b: bStar };
}

// ---------------------------------------------------------------------------
// CIELAB → sRGB (via XYZ)
// ---------------------------------------------------------------------------

/**
 * Convert CIELAB back to sRGB (0-255, clamped).
 */
export function labToRgb(
  L: number,
  a: number,
  b: number,
): { r: number; g: number; b: number } {
  // 1. Lab → XYZ
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx * fx * fx > EPSILON ? fx * fx * fx : (116 * fx - 16) / KAPPA;
  const yr = L > KAPPA * EPSILON ? Math.pow((L + 16) / 116, 3) : L / KAPPA;
  const zr = fz * fz * fz > EPSILON ? fz * fz * fz : (116 * fz - 16) / KAPPA;

  let x = xr * REF_X / 100;
  let y = yr * REF_Y / 100;
  let z = zr * REF_Z / 100;

  // 2. XYZ → linear RGB (inverse sRGB matrix)
  let rr = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let gg = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  let bb = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // 3. Gamma compression (linear → sRGB)
  rr = rr > 0.0031308 ? 1.055 * Math.pow(rr, 1 / 2.4) - 0.055 : 12.92 * rr;
  gg = gg > 0.0031308 ? 1.055 * Math.pow(gg, 1 / 2.4) - 0.055 : 12.92 * gg;
  bb = bb > 0.0031308 ? 1.055 * Math.pow(bb, 1 / 2.4) - 0.055 : 12.92 * bb;

  // 4. Scale & clamp to 0-255
  const clamp = (v: number): number => Math.max(0, Math.min(255, Math.round(v * 255)));

  return { r: clamp(rr), g: clamp(gg), b: clamp(bb) };
}

// ---------------------------------------------------------------------------
// Delta E 1976 (simple Euclidean distance in Lab)
// ---------------------------------------------------------------------------

/**
 * CIE76 colour difference — Euclidean distance in CIELAB.
 */
export function deltaE76(lab1: Lab, lab2: Lab): number {
  const dL = lab1.L - lab2.L;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// ---------------------------------------------------------------------------
// CIEDE2000
// ---------------------------------------------------------------------------

/**
 * CIEDE2000 colour-difference (ΔE00).
 *
 * Implemented from:
 *   Sharma, Wu, Dalal — "The CIEDE2000 Color-Difference Formula:
 *   Implementation Notes, Supplementary Test Data, and Mathematical
 *   Observations", Color Research & Application, 2005.
 *
 * Parametric weighting factors kL, kC, kH are all set to 1 (reference
 * conditions).
 */
export function ciede2000(lab1: Lab, lab2: Lab): number {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;

  // --- Step 1: Calculate C'ab, h'ab ---

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cab_mean = (C1 + C2) / 2;

  const Cab_mean_pow7 = Math.pow(Cab_mean, 7);
  const twentyFive_pow7 = 6103515625; // 25^7
  const G = 0.5 * (1 - Math.sqrt(Cab_mean_pow7 / (Cab_mean_pow7 + twentyFive_pow7)));

  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);

  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

  // Hue angles in degrees [0, 360)
  let h1Prime = Math.atan2(b1, a1Prime) * RAD2DEG;
  if (h1Prime < 0) h1Prime += 360;

  let h2Prime = Math.atan2(b2, a2Prime) * RAD2DEG;
  if (h2Prime < 0) h2Prime += 360;

  // --- Step 2: Calculate ΔL', ΔC', ΔH' ---

  const dLPrime = L2 - L1;
  const dCPrime = C2Prime - C1Prime;

  let dhPrime: number;
  if (C1Prime * C2Prime === 0) {
    // One or both colours are achromatic — hue difference is 0
    dhPrime = 0;
  } else if (Math.abs(h2Prime - h1Prime) <= 180) {
    dhPrime = h2Prime - h1Prime;
  } else if (h2Prime - h1Prime > 180) {
    dhPrime = h2Prime - h1Prime - 360;
  } else {
    // h2Prime - h1Prime < -180
    dhPrime = h2Prime - h1Prime + 360;
  }

  // ΔH' (note: capital H, not lowercase h)
  const dHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((dhPrime / 2) * DEG2RAD);

  // --- Step 3: Calculate CIEDE2000 ΔE00 ---

  const LPrime_mean = (L1 + L2) / 2;
  const CPrime_mean = (C1Prime + C2Prime) / 2;

  let hPrime_mean: number;
  if (C1Prime * C2Prime === 0) {
    // When one or both chroma values are 0, mean hue is the sum
    hPrime_mean = h1Prime + h2Prime;
  } else if (Math.abs(h1Prime - h2Prime) <= 180) {
    hPrime_mean = (h1Prime + h2Prime) / 2;
  } else if (h1Prime + h2Prime < 360) {
    hPrime_mean = (h1Prime + h2Prime + 360) / 2;
  } else {
    hPrime_mean = (h1Prime + h2Prime - 360) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos((hPrime_mean - 30) * DEG2RAD) +
    0.24 * Math.cos(2 * hPrime_mean * DEG2RAD) +
    0.32 * Math.cos((3 * hPrime_mean + 6) * DEG2RAD) -
    0.20 * Math.cos((4 * hPrime_mean - 63) * DEG2RAD);

  const LPrime_mean_minus50_sq = (LPrime_mean - 50) * (LPrime_mean - 50);
  const SL = 1 + 0.015 * LPrime_mean_minus50_sq / Math.sqrt(20 + LPrime_mean_minus50_sq);
  const SC = 1 + 0.045 * CPrime_mean;
  const SH = 1 + 0.015 * CPrime_mean * T;

  const CPrime_mean_pow7 = Math.pow(CPrime_mean, 7);
  const RC = 2 * Math.sqrt(CPrime_mean_pow7 / (CPrime_mean_pow7 + twentyFive_pow7));

  const dTheta = 30 * Math.exp(-Math.pow((hPrime_mean - 275) / 25, 2));
  const RT = -Math.sin(2 * dTheta * DEG2RAD) * RC;

  // Parametric factors (reference conditions)
  const kL = 1;
  const kC = 1;
  const kH = 1;

  const termL = dLPrime / (kL * SL);
  const termC = dCPrime / (kC * SC);
  const termH = dHPrime / (kH * SH);

  return Math.sqrt(
    termL * termL +
      termC * termC +
      termH * termH +
      RT * termC * termH,
  );
}

// ---------------------------------------------------------------------------
// Nearest-colour search
// ---------------------------------------------------------------------------

/**
 * Find the perceptually closest colour from `palette` to the target sRGB
 * colour, using CIEDE2000.
 *
 * @returns The matched palette entry and the ΔE00 distance.
 */
export function findNearestColor<T extends { r: number; g: number; b: number }>(
  targetR: number,
  targetG: number,
  targetB: number,
  palette: T[],
): { color: T; distance: number } {
  if (palette.length === 0) {
    throw new Error("findNearestColor: palette must not be empty");
  }

  const targetLab = rgbToLab(targetR, targetG, targetB);

  let bestColor: T = palette[0];
  let bestDistance = Infinity;

  for (const entry of palette) {
    const entryLab = rgbToLab(entry.r, entry.g, entry.b);
    const dist = ciede2000(targetLab, entryLab);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestColor = entry;
    }
  }

  return { color: bestColor, distance: bestDistance };
}

/**
 * Find the N perceptually closest colours from `palette` to the target sRGB
 * colour, sorted by CIEDE2000 distance ascending.
 */
export function findNearestColors<T extends { r: number; g: number; b: number }>(
  targetR: number,
  targetG: number,
  targetB: number,
  palette: T[],
  n: number,
): { color: T; distance: number }[] {
  if (palette.length === 0) {
    return [];
  }

  const targetLab = rgbToLab(targetR, targetG, targetB);

  const ranked = palette.map((entry) => {
    const entryLab = rgbToLab(entry.r, entry.g, entry.b);
    return { color: entry, distance: ciede2000(targetLab, entryLab) };
  });

  ranked.sort((a, b) => a.distance - b.distance);

  return ranked.slice(0, n);
}
