import React from 'react';
import {StyleProp, TextInputProps as RNTextInputProps, ViewStyle} from 'react-native';
import {useTheme} from '@core/theme';
import {Box, Text} from './primitives';
import {TextInput} from './TextInput';

type Props = RNTextInputProps & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * InputField
 *
 * A labeled, bordered text input with:
 * - Optional label above
 * - Optional icon (left or right)
 * - Error message below
 * - Focus state border color change
 */
export function InputField({
  label,
  error,
  icon,
  iconPosition = 'left',
  containerStyle,
  autoCapitalize = 'none',
  ...props
}: Props) {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const borderColor = error
    ? 'borderError'
    : isFocused
      ? 'borderFocus'
      : 'border';

  return (
    <Box style={containerStyle}>
      {label ? (
        <Text variant="label" color="text" marginBottom="xs">
          {label}
        </Text>
      ) : null}

      <Box
        borderWidth={1}
        borderRadius="md"
        paddingHorizontal="md"
        paddingVertical="md"
        backgroundColor="inputBackground"
        borderColor={borderColor}
        flexDirection="row"
        alignItems="center">
        {icon && iconPosition === 'left' ? (
          <Box marginRight="sm">{icon}</Box>
        ) : null}

        <TextInput
          autoCapitalize={autoCapitalize}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {icon && iconPosition === 'right' ? (
          <Box marginLeft="sm">{icon}</Box>
        ) : null}
      </Box>

      {error ? (
        <Text
          variant="caption"
          style={{color: theme.colors.error, marginTop: 4}}>
          {error}
        </Text>
      ) : null}
    </Box>
  );
}
