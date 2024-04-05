import { StyleSheet } from 'react-native';
import { colorPalette, colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

export const toast = StyleSheet.create({
  base: {
    padding: normalize(16),
    borderRadius: 6,
  },
  closeIcon: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export const toastBackground = StyleSheet.create({
  normal: {
    backgroundColor: colorPalette.primary700,
  },
  error: {
    backgroundColor: colorPalette.error300,
  },
});

export const toastText = StyleSheet.create({
  normal: {
    color: colors.text.textDefault,
  },
  error: {
    color: colorPalette.grey900,
  },
});
