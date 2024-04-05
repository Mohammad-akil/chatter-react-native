import { FlatList, Linking, NativeModules, Platform } from 'react-native';
import type { ObjectKeysMatching } from '../types';
import type { Language } from '../i18n/types';
// import { MMKV } from '../state';

import { localesLanguges } from '~/i18n/constants';
import moment from 'moment';
import { RefObject } from 'react';
import { normalize } from './normalize';
import { MMKV } from '~/services/mmkv/config';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import { FlashList } from '@shopify/flash-list';

export function filterListByStringField<T extends Record<string, unknown>>(
  list: T[],
  key: ObjectKeysMatching<T, string>,
  search: string,
): T[];
export function filterListByStringField<T extends Record<string, unknown>>(
  list: T[],
  keys: ObjectKeysMatching<T, string>[],
  search: string,
): T[];
export function filterListByStringField<T extends Record<string, unknown>>(
  list: T[],
  key: ObjectKeysMatching<T, string> | ObjectKeysMatching<T, string>[],
  search: string,
): T[] {
  const keys = Array.isArray(key) ? key : [key];
  const formattedSearch = search.toLowerCase();

  return list.filter((item) => {
    return keys.some((key) => {
      const value = (item[key] as string).toLowerCase();

      return value.includes(formattedSearch);
    });
  });
}

export const filterSelectedItems = <T extends string | number>(ids: T[], id: T) => {
  const isSelected = ids.includes(id);

  return isSelected ? ids.filter((c) => c !== id) : [...ids, id];
};

export const detectStoredLanguage = (): Language | null => {
  const language = MMKV.getString('language');

  return isValidLanguage(language) ? language : null;
};

export const detectDeviceLanguage = (): Language | null => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  const [language] = locale.split('_');

  return isValidLanguage(language) ? language : null;
};

export const isValidLanguage = (language: string): language is Language => {
  return localesLanguges.includes(language as Language);
};

export const chunkArray = (array: any, size: any) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size),
  );
};

export const utcDateToString = (momentInUTC: any): string => {
  const formattedDate = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return formattedDate;
};

export const generateRandomId = () => {
  const randomNum = Math.floor(Math.random() * 100000000);
  return randomNum;
};

export const scrollToBottom = (
  messagesListRef: RefObject<FlatList<any>> | RefObject<FlashList<any>>,
  contentHeight: number,
  offsetNum: number,
  animated: boolean,
) => {
  if (messagesListRef.current) {
    const offset = normalize(offsetNum);
    const yPosition = contentHeight + offset;

    messagesListRef.current.scrollToOffset({ offset: yPosition, animated });
  }
};
export const errorPermissions = () => {
  Toast.show({
    type: 'error',
    text1: `Something wrong. Please, add permissions and try again.`,
    topOffset: normalize(80),
    autoHide: true,
    props: {
      withButtons: true,
      onAccept: () => {
        Linking.openSettings();
      },
      acceptButtonText: 'Go to settings',
    },
  } as CustomShowParams);
};
