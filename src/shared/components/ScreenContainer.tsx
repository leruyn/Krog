import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@core/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * ScreenContainer
 *
 * Wraps screen content with SafeAreaView and themed background.
 * Use as the root element of every screen.
 */
export function ScreenContainer({children, style}: Props) {
  const {theme} = useTheme();

  return (
    <SafeAreaView
      style={[{flex: 1, backgroundColor: theme.colors.background}, style]}>
      {children}
    </SafeAreaView>
  );
}
