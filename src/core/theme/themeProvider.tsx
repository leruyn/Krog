import React from 'react';
import {useColorScheme} from 'react-native';
import {
  ThemeProvider as RestyleThemeProvider,
  useTheme as useRestyleTheme,
} from '@shopify/restyle';
import {darkTheme, lightTheme, AppTheme} from './theme';

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  return <RestyleThemeProvider theme={theme}>{children}</RestyleThemeProvider>;
}

/**
 * Typed useTheme hook. Always use this instead of Restyle's raw useTheme.
 */
export function useTheme() {
  const theme = useRestyleTheme<AppTheme>();
  return {theme};
}
