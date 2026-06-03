import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Box} from './primitives';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: boolean;
};

/**
 * Card
 *
 * A rounded surface container with border.
 * Use for grouping related content.
 */
export function Card({children, style, padding = true}: Props) {
  return (
    <Box
      backgroundColor="surface"
      borderRadius="lg"
      borderWidth={1}
      borderColor="border"
      padding={padding ? 'lg' : undefined}
      style={style}>
      {children}
    </Box>
  );
}
