import viCommon from './locales/vi/common.json';
import enCommon from './locales/en/common.json';
import viAuth from './locales/vi/auth.json';
import enAuth from './locales/en/auth.json';

export const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
  },
  en: {
    common: enCommon,
    auth: enAuth,
  },
} as const;

// TypeScript declarations for namespaces
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['vi'];
  }
}
