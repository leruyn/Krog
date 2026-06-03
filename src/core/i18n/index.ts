import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {resources} from './resources';

export const DEFAULT_LANGUAGE = 'vi' as const;
export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = '@RNBase/i18nLanguage';

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

async function resolveInitialLanguage(): Promise<SupportedLanguage> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(stored)) return stored;
  } catch {
    // ignore read errors
  }
  return DEFAULT_LANGUAGE;
}

let initialized = false;
let initPromise: Promise<typeof i18n> | null = null;

export async function initI18n() {
  if (initialized) return i18n;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const lng = await resolveInitialLanguage();

    await i18n.use(initReactI18next).init({
      resources,
      lng,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      interpolation: {escapeValue: false},
      compatibilityJSON: 'v4',
      returnNull: false,
      react: {useSuspense: false},
    });

    initialized = true;
    return i18n;
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}

export async function setAppLanguage(lang: SupportedLanguage) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export {i18n};
