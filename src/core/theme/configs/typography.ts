import {fontFamilies} from './fonts';

/**
 * Typography Scale
 *
 * Variants align with Restyle's textVariants.
 * Usage: <Text variant="h1">Hello</Text>
 */
export const typography = {
  defaults: {
    fontSize: 15,
    fontFamily: fontFamilies.regular,
    lineHeight: 22,
  },

  // ── Display ──────────────────────────────────────────────────────────────
  hero: {fontSize: 48, fontFamily: fontFamilies.bold, lineHeight: 56, letterSpacing: -1.5},
  display: {fontSize: 36, fontFamily: fontFamilies.bold, lineHeight: 44, letterSpacing: -1},

  // ── Headings ─────────────────────────────────────────────────────────────
  h1: {fontSize: 30, fontFamily: fontFamilies.bold, lineHeight: 38, letterSpacing: -0.8},
  h2: {fontSize: 24, fontFamily: fontFamilies.bold, lineHeight: 32, letterSpacing: -0.5},
  h3: {fontSize: 20, fontFamily: fontFamilies.bold, lineHeight: 28},
  h4: {fontSize: 17, fontFamily: fontFamilies.semiBold, lineHeight: 24},

  // ── Subheadings ──────────────────────────────────────────────────────────
  header: {fontSize: 18, fontFamily: fontFamilies.bold, lineHeight: 26},
  subheader: {fontSize: 15, fontFamily: fontFamilies.medium, lineHeight: 22},
  title: {fontSize: 15, fontFamily: fontFamilies.bold, lineHeight: 22},

  // ── Body ─────────────────────────────────────────────────────────────────
  body: {fontSize: 15, fontFamily: fontFamilies.regular, lineHeight: 22},
  bodyMd: {fontSize: 15, fontFamily: fontFamilies.medium, lineHeight: 22},
  subtitle: {fontSize: 13, fontFamily: fontFamilies.regular, lineHeight: 18},

  // ── Labels / Buttons ─────────────────────────────────────────────────────
  label: {fontSize: 13, fontFamily: fontFamilies.semiBold, lineHeight: 18, letterSpacing: 0.2},
  button: {fontSize: 15, fontFamily: fontFamilies.semiBold, lineHeight: 20, letterSpacing: 0.3},
  overline: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },

  // ── Small Text ───────────────────────────────────────────────────────────
  caption: {fontSize: 12, fontFamily: fontFamilies.regular, lineHeight: 16},
  micro: {fontSize: 10, fontFamily: fontFamilies.regular, lineHeight: 14},
};
