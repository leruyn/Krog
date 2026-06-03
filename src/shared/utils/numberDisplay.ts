/**
 * Number display utilities
 *
 * Centralize all number formatting so locale changes only require
 * updating this file.
 */

const VN_LOCALE = 'vi-VN';

/**
 * Format a number as Vietnamese currency (VNĐ).
 * Example: formatCurrency(1500000) → "1.500.000 ₫"
 */
export function formatCurrency(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(VN_LOCALE, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * Format a plain number with thousand separators.
 * Example: formatNumber(1500000) → "1.500.000"
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(VN_LOCALE, {
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format a percentage.
 * Example: formatPercent(0.145) → "14,5%"
 */
export function formatPercent(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat(VN_LOCALE, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
