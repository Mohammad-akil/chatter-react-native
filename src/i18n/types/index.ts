import type { ObjectValues } from '../../types';
import { locales } from '../constants';
import type { en } from '../locales/en';

export type Translation = typeof en;

export type Language = ObjectValues<typeof locales>;
export type Resources = {
  [K in Language]: { translation: Translation };
};
