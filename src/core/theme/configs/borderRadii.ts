export const borderRadii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  /** Pill / circular shape */
  full: 9999,
};

export type BorderRadius = keyof typeof borderRadii;
