import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {ButtonSize, ButtonVariant, useTheme} from '@core/theme';
import {Box, Text} from './primitives';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: ButtonSize;
  variant?: ButtonVariant;
  /** Optional icon placed before the title text */
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  contentStyle,
  size = 'md',
  variant = 'primary',
  icon,
}: Props) {
  const {theme} = useTheme();
  const sizeConfig = theme.button.sizes[size];
  const variantConfig = theme.button.variants[variant];
  const isDisabled = disabled || loading;

  const bgColor = isDisabled ? 'disabledBackground' : variantConfig.backgroundColor;
  const txtColor = isDisabled ? 'disabledText' : variantConfig.textColor;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={isDisabled}
      style={style}>
      <Box
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        backgroundColor={bgColor}
        opacity={isDisabled ? 0.6 : 1}
        style={[
          {
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            borderRadius: sizeConfig.borderRadius,
          },
          contentStyle,
        ]}>
        {loading && <ActivityIndicator color={theme.colors[txtColor]} style={{marginRight: 8}} />}
        {!loading && icon && <Box marginRight="sm">{icon}</Box>}
        {!!title && (
          <Text
            variant="button"
            color={txtColor}
            style={[{fontSize: sizeConfig.fontSize}, textStyle]}>
            {title}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
