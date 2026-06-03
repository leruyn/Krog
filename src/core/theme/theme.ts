import {createTheme} from '@shopify/restyle';
import {
  lightColors,
  darkColors,
  spacing,
  borderRadii,
  iconSizes,
  opacity,
  typography,
  buttonConfig,
  avatarConfig,
  fontSizes,
  fontWeights,
  fontFamilies,
} from './configs';

export const lightTheme = createTheme({
  isDark: false,
  colors: lightColors,
  spacing,
  borderRadii,
  iconSizes,
  opacity,
  textVariants: typography,
  button: buttonConfig,
  avatar: avatarConfig,
  fontSizes,
  fontWeights,
  fontFamilies,
});

/**
 * Dark theme: same structure as lightTheme, only `colors` changes.
 * Never spread Restyle theme objects with createTheme — use type assertion.
 */
export const darkTheme: typeof lightTheme = {
  ...lightTheme,
  isDark: true,
  colors: darkColors,
};

export type AppTheme = typeof lightTheme;
