/**
 * Palette for the classic pack background colors
 */
export const CLASSIC_PALETTE = [
  '#fed475', // Light orange
  '#fec443', // Golden yellow
  '#febc29', // Amber
  '#feb410', // Deep yellow
  '#fe8d10', // Orange
  '#fe895c'  // Coral
];

/**
 * Returns the next color in the classic palette
 * @param currentIndex The current index in the palette, or undefined to get the first color
 * @returns An object with the next color and its index
 */
export const getNextClassicColor = (currentIndex?: number): { color: string; index: number } => {
  // If no current index or out of bounds, start from the beginning
  if (currentIndex === undefined || currentIndex < 0 || currentIndex >= CLASSIC_PALETTE.length - 1) {
    return { color: CLASSIC_PALETTE[0], index: 0 };
  }
  
  // Move to the next color
  return { 
    color: CLASSIC_PALETTE[currentIndex + 1], 
    index: currentIndex + 1 
  };
}; 