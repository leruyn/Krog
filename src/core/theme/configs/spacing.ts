/**
 * Spacing Design Tokens (4px grid)
 *
 * Convention:
 *  - T-shirt sizes (xs/sm/md/lg/xl/xxl/3xl/4xl) → canonical 4px-grid scale.
 *  - Numeric pixel-value keys → intermediate steps not on grid.
 */
export const spacing = {
  none: 0,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  '3xl': 48,
  '4xl': 64,
  '5xl': 96,

  // Intermediate steps
  '2': 2,
  '6': 6,
  '10': 10,
  '14': 14,
  '18': 18,
  '20': 20,
  '28': 28,
  '40': 40,
};

export type Spacing = keyof typeof spacing;
