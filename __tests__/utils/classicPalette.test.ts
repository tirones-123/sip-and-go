import { CLASSIC_PALETTE, getNextClassicColor } from '../../src/utils/classicPalette';

describe('classicPalette utilities', () => {
  it('should have exactly 6 colors in the palette', () => {
    expect(CLASSIC_PALETTE).toHaveLength(6);
  });

  it('should return the first color when no index is provided', () => {
    const { color, index } = getNextClassicColor();
    expect(color).toBe(CLASSIC_PALETTE[0]);
    expect(index).toBe(0);
  });

  it('should return the next color in the palette', () => {
    const { color, index } = getNextClassicColor(2);
    expect(color).toBe(CLASSIC_PALETTE[3]);
    expect(index).toBe(3);
  });

  it('should return the first color when the last index is provided', () => {
    const { color, index } = getNextClassicColor(5);
    expect(color).toBe(CLASSIC_PALETTE[0]);
    expect(index).toBe(0);
  });

  it('should return the first color when an out-of-bounds index is provided', () => {
    const { color, index } = getNextClassicColor(999);
    expect(color).toBe(CLASSIC_PALETTE[0]);
    expect(index).toBe(0);
  });

  it('should return the first color when a negative index is provided', () => {
    const { color, index } = getNextClassicColor(-1);
    expect(color).toBe(CLASSIC_PALETTE[0]);
    expect(index).toBe(0);
  });
}); 