export const buttonConfig = {
  sizes: {
    sm: {paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, fontSize: 13},
    md: {paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, fontSize: 15},
    lg: {paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, fontSize: 16},
  },
  variants: {
    primary: {
      backgroundColor: 'buttonPrimary' as const,
      textColor: 'buttonPrimaryText' as const,
    },
    secondary: {
      backgroundColor: 'surface' as const,
      textColor: 'text' as const,
    },
    danger: {
      backgroundColor: 'danger' as const,
      textColor: 'primaryContrast' as const,
    },
    ghost: {
      backgroundColor: 'background' as const,
      textColor: 'primary' as const,
    },
  },
} as const;

export type ButtonSize = keyof typeof buttonConfig.sizes;
export type ButtonVariant = keyof typeof buttonConfig.variants;
