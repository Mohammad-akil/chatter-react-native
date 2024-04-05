import { en } from './locales/en';
import { es } from './locales/es';
import { Resources } from './types';

export const locales = {
  english: 'en',
  spanish: 'es',
} as const;
export const localesLanguges = Object.values(locales);
export const resources: Resources = {
  en: { translation: en },
  es: { translation: es },
};
