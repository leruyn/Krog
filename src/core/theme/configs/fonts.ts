/**
 * Font System
 *
 * Default: Inter (system sans-serif). Replace fontFamilies values with
 * the actual font file names you bundle in your project.
 *
 * To use a different font family:
 * 1. Add the .ttf files to android/app/src/main/assets/fonts/
 * 2. Add to ios/RNBase/Info.plist under UIAppFonts
 * 3. Update fontFamilies below to match the exact PostScript names.
 */

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  xxxxl: 36,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

/**
 * Update these with the actual font files you include.
 * Using system default (undefined) means the OS default sans-serif is used.
 */
export const fontFamilies = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  italic: 'Inter-Italic',
  mediumItalic: 'Inter-MediumItalic',
  boldItalic: 'Inter-BoldItalic',
  pangolin: 'Pangolin-Regular',
} as const;

export const fontFamilyByWeight: Record<string, string> = {
  '100': fontFamilies.regular,
  '200': fontFamilies.regular,
  '300': fontFamilies.regular,
  '400': fontFamilies.regular,
  '500': fontFamilies.medium,
  '600': fontFamilies.semiBold,
  '700': fontFamilies.bold,
  '800': fontFamilies.bold,
  '900': fontFamilies.bold,
  normal: fontFamilies.regular,
  bold: fontFamilies.bold,
};

export const DEFAULT_FONT_FAMILY = fontFamilies.regular;
