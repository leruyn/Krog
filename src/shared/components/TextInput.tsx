import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
} from 'react-native';
import {useTheme} from '@core/theme';
import {DEFAULT_FONT_FAMILY} from '@core/theme/configs/fonts';

type Props = RNTextInputProps;

/**
 * Base TextInput with theme-aware text color and font.
 * Use InputField for a labeled/bordered input with error state.
 */
export function TextInput({style, ...props}: Props) {
  const {theme} = useTheme();

  return (
    <RNTextInput
      style={[
        styles.input,
        {
          color: theme.colors.text,
          fontFamily: DEFAULT_FONT_FAMILY,
        },
        style,
      ]}
      placeholderTextColor={theme.colors.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 0,
    flex: 1,
    fontSize: 15,
  },
});
