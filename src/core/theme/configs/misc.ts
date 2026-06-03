/**
 * Miscellaneous design tokens: icon sizes, opacity levels, avatar sizes.
 * Kept in one file since they are small and closely related.
 */

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  subtle: 0.8,
  full: 1,
} as const;

export const avatarConfig = {
  sizes: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
} as const;
