/**
 * Converts a hex color to HSL
 * @param hex Hex color code (e.g. #FF5A92)
 * @returns HSL object { h, s, l }
 */
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the RGB components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Converts HSL to hex color
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns Hex color code
 */
const hslToHex = (h: number, s: number, l: number): string => {
  // Convert to 0-1 range
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  // Convert to hex
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Generate a random variation of a color
 * @param baseColor Base color in hex format
 * @param hueShift Maximum hue shift amount (in degrees)
 * @param saturationVariation Maximum saturation variation percentage
 * @param lightnessVariation Maximum lightness variation percentage
 * @param maxLightness Maximum allowed lightness (default 60)
 * @returns A new hex color
 */
export const randomColorVariation = (
  baseColor: string,
  hueShift = 10,
  saturationVariation = 5,
  lightnessVariation = 5,
  maxLightness = 50
): string => {
  const hsl = hexToHSL(baseColor);
  
  // Apply random variations
  const randomHueShift = (Math.random() * 2 - 1) * hueShift;
  const randomSaturationShift = (Math.random() * 2 - 1) * saturationVariation;
  const randomLightnessShift = -Math.random() * lightnessVariation;
  
  const newHue = (hsl.h + randomHueShift + 360) % 360;
  const newSaturation = Math.max(0, Math.min(100, hsl.s + randomSaturationShift));
  let newLightness = Math.max(0, Math.min(100, hsl.l + randomLightnessShift));
  
  // Ensure the resulting lightness does not exceed the allowed maximum.
  if (newLightness > maxLightness) {
    newLightness = maxLightness;
  }
  
  return hslToHex(newHue, newSaturation, newLightness);
};

/**
 * Lightens a hex color by mixing it with white.
 * @param baseColor Hex color string (e.g. #FF5A92)
 * @param ratio 0 → no change, 1 → pure white. Default 0.4 (40 % white)
 */
export const tintColor = (baseColor: string, ratio = 0.4): string => {
  // Clamp
  const mix = Math.min(Math.max(ratio, 0), 1);

  const hex = baseColor.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.round(r + (255 - r) * mix);
  const newG = Math.round(g + (255 - g) * mix);
  const newB = Math.round(b + (255 - b) * mix);

  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}; 