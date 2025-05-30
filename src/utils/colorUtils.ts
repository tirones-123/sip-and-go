/**
 * Mixes a color with white to create a lighter tint.
 * @param color The base hex color string (e.g., '#FF0000').
 * @param amount The amount of white to mix, from 0 (original color) to 1 (pure white).
 * @returns The tinted hex color string.
 */
export const tintColor = (color: string, amount: number): string => {
  'worklet';
  // Clamp amount between 0-1
  const a = Math.max(0, Math.min(1, amount));

  const R = parseInt(color.substring(1, 3), 16);
  const G = parseInt(color.substring(3, 5), 16);
  const B = parseInt(color.substring(5, 7), 16);

  const mix = (channel: number): number => Math.round(channel + (255 - channel) * a);

  const RR = mix(R).toString(16).padStart(2, '0');
  const GG = mix(G).toString(16).padStart(2, '0');
  const BB = mix(B).toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}; 