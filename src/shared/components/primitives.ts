import {createBox, createText} from '@shopify/restyle';
import type {AppTheme} from '@core/theme/theme';

/** Restyle Box - use for layout with theme-aware props */
export const Box = createBox<AppTheme>();

/** Restyle Text - use for all text with theme-aware typography */
export const Text = createText<AppTheme>();
