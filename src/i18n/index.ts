import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from './types';
import { detectDeviceLanguage, detectStoredLanguage } from '../utils';
import { resources } from './constants';

i18n
  .use({
    type: 'languageDetector',
    detect: (): Language => {
      const storedLanguage = detectStoredLanguage();
      const deviceLanguage = detectDeviceLanguage();

      return storedLanguage ?? deviceLanguage ?? 'en';
    },
  })
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
  });

export default i18n;
