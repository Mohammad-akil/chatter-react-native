import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { type ColorStyleOptions, type SizeStyleOptions } from './types';

import { colorPalette, colors } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { normalize } from '~/utils/normalize';

const containerBaseStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    gap: 6,
  },
});

const containerSizeStyles: SizeStyleOptions<ViewStyle> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: normalize(16),
  },
  'sm-eq': {
    padding: 8,
  },
  md: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
  },
  'md-eq': {
    padding: normalize(10),
  },
  lg: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
  },
  'lg-eq': {
    padding: normalize(10),
  },
  xl: {
    paddingVertical: normalize(4),
  },
  'xl-eq': {
    padding: normalize(4),
    paddingVertical: normalize(8),
  },
  '2xl': {
    padding: 0,
    width: normalize(72),
    height: normalize(72),
  },
};

const containerColorStyles: ColorStyleOptions<ViewStyle> = {
  primary: {
    backgroundColor: colors.surface.buttonPrimaryNormal,
  },
  'primary-pressed': {
    backgroundColor: colors.surface.buttonPrimaryPressed,
  },
  'primary-disabled': {
    backgroundColor: colors.surface.buttonPrimaryDisabled,
  },
  // Secondary
  secondary: {
    backgroundColor: colors.surface.buttonDefaultNormal,
  },
  'secondary-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'secondary-disabled': {
    backgroundColor: colors.surface.buttonDefaultDisabled,
  },
  // Ghost
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },
  'ghost-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },
  'ghost-disabled': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.borderDisabled,
  },
  'ghost-active': {
    backgroundColor: colorPalette.white,
  },
  // Text
  text: {
    backgroundColor: 'transparent',
  },
  'text-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'text-disabled': {
    backgroundColor: 'transparent',
  },
  'text-inverted': {
    backgroundColor: 'transparent',
  },
  'text-inverted-pressed': {
    backgroundColor: colorPalette.grey200,
  },
  'text-inverted-disabled': {
    backgroundColor: 'transparent',
  },
  'text-active': {
    backgroundColor: colorPalette.white,
  },

  // Link
  link: {
    backgroundColor: 'transparent',
  },
  'link-pressed': {
    backgroundColor: 'transparent',
  },
  'link-disabled': {
    backgroundColor: 'transparent',
  },

  // Black
  black: {
    backgroundColor: colorPalette.black,
  },
  'black-pressed': {
    backgroundColor: colorPalette.grey900,
  },
  'black-disabled': {
    backgroundColor: colorPalette.grey900,
  },

  // Cancel
  cancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colorPalette.error400,
  },
  'cancel-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
    borderWidth: 1,
    borderColor: colorPalette.error400,
  },
  'cancel-disabled': {
    backgroundColor: colors.surface.buttonDefaultDisabled,
    borderWidth: 1,
    borderColor: colorPalette.error300,
  },

  // Report
  report: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    borderWidth: 1,
    borderColor: colors.surface.buttonDefaultNormal,
  },
  'report-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
    borderWidth: 1,
    borderColor: colorPalette.error400,
  },
  'report-disabled': {
    backgroundColor: colors.surface.buttonDefaultDisabled,
    borderWidth: 1,
    borderColor: colors.surface.buttonDefaultNormal,
  },

  //RED
  red: {
    backgroundColor: colorPalette.error600,
  },
  'red-pressed': {
    backgroundColor: colorPalette.error700,
  },

  //TOAST NORMAL
  'toast-normal': {
    backgroundColor: 'transparent',
  },
  'toast-normal-pressed': {
    backgroundColor: colorPalette.primary800,
  },

  //TOAST OUTLINED NORMAL
  'toast-outlined-normal': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },
  'toast-outlined-normal-pressed': {
    backgroundColor: colorPalette.primary800,
  },

  //TOAST ERROR
  'toast-error': {
    backgroundColor: 'transparent',
    borderColor: colorPalette.grey900,
  },
  'toast-error-pressed': {
    backgroundColor: colorPalette.error400,
  },

  //TOAST OUTLINED ERRROR
  'toast-outlined-error': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colorPalette.grey900,
  },
  'toast-outlined-error-pressed': {
    backgroundColor: colorPalette.error400,
  },

  // CONTRIBUTE
  contribute: {
    height: normalize(42),
    paddingVertical: 0,
    paddingHorizontal: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.success600,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'contribute-pressed': {
    backgroundColor: colorPalette.success700,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'contribute-active': {
    backgroundColor: colorPalette.success600,
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },

  // CONTRIBUTE OPTION

  'contribute-option': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },

  'contribute-option-pressed': {
    backgroundColor: colors.surface.surfacePrimary,
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },

  'contribute-option-active': {
    backgroundColor: colorPalette.primary700,
    borderWidth: 1,
    borderColor: colors.border.borderFocused,
  },
};

const contentBaseStyles = StyleSheet.create({
  base: {
    color: colors.text.textDefault,
    fontFamily: typography.body.medium.fontFamily,
    fontWeight: typography.body.medium.fontWeight,
  },
});

const contentSizeStyles: SizeStyleOptions<TextStyle> = {
  sm: {
    fontSize: typography.body.semibold.fontSize,
    lineHeight: typography.body.semibold.lineHeight,
  },
  md: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
  },
  lg: {
    fontSize: typography.body.large.fontSize,
    lineHeight: typography.body.large.lineHeight,
  },
  xl: {
    fontSize: 28,
    lineHeight: 34,
  },
  '2xl': {
    fontSize: typography.label.large.fontSize,
    lineHeight: typography.label.large.fontSize,
  },
};

const contentColorStyles: ColorStyleOptions<TextStyle> = {
  primary: {
    color: colors.text.textDefault,
  },
  'primary-pressed': {
    color: colors.text.textDefault,
  },
  'primary-disabled': {
    color: colors.text.textDisabled,
  },
  // Secondary
  secondary: {
    color: colors.text.textDefault,
  },
  'secondary-pressed': {
    color: colors.text.textDefault,
  },
  'secondary-disabled': {
    color: colors.text.textDisabled,
  },

  // Ghost
  ghost: {
    color: colors.text.textDefault,
  },
  'ghost-pressed': {
    color: colors.text.textDefault,
  },
  'ghost-disabled': {
    color: colors.text.textDisabled,
  },
  'ghost-active': {
    color: colorPalette.black,
  },

  // Text
  text: {
    color: colors.text.textDefault,
  },
  'text-pressed': {
    color: colors.text.textDefault,
  },
  'text-disabled': {
    color: colors.text.textDisabled,
  },
  'text-inverted': {
    color: colorPalette.grey900,
  },
  'text-inverted-pressed': {
    color: colorPalette.grey900,
  },
  'text-inverted-disabled': {
    color: colorPalette.grey800,
  },

  // Link
  link: {
    color: colorPalette.primary500,
  },
  'link-pressed': {
    color: colorPalette.primary600,
  },
  'link-disabled': {
    color: colorPalette.primary700,
  },

  // Black
  black: {
    color: colorPalette.white,
  },
  'black-pressed': {
    color: colorPalette.white,
  },
  'black-disabled': {
    color: colors.text.textDisabled,
  },

  // Cancel
  cancel: {
    color: colorPalette.error400,
  },
  'cancel-pressed': {
    color: colorPalette.error400,
  },
  'cancel-disabled': {
    color: colorPalette.error300,
  },

  // Report
  report: {
    color: colorPalette.error400,
  },
  'report-pressed': {
    color: colorPalette.error400,
  },
  'report-disabled': {
    color: colorPalette.error300,
  },

  //RED
  red: {
    color: colorPalette.white,
  },
  'red-pressed': {
    color: colorPalette.white,
  },

  //TOAST_NORMAL
  'toast-normal': {
    color: colors.text.textDefault,
  },

  //TOAST_NORMAL
  'toast-outlined-normal': {
    color: colors.text.textDefault,
  },

  //TOAST ERROR
  'toast-error': {
    color: colorPalette.grey900,
  },

  //TOAST OUTLINED ERROR
  'toast-outlined-error': {
    color: colorPalette.grey900,
  },

  // CONTRIBUTE
  contribute: {
    color: colors.text.textDefault,
  },

  'contribute-pressed': {
    color: colors.text.textDefault,
  },

  'contribute-active': {
    color: colors.text.textDefault,
  },

  // CONTRIBUTE OPTION
  'contribute-option': {
    color: colors.text.textDefault,
  },
  'contribute-option-pressed': {
    color: colors.text.textDefault,
  },
  'contribute-option-active': {
    color: colors.text.textDefault,
  },
};

export const iconSize: SizeStyleOptions<number> = {
  sm: normalize(16),
  md: normalize(20),
  lg: normalize(24),
  xl: normalize(30),
};

export const containerStyles = StyleSheet.create({
  ...containerBaseStyles,
  ...containerSizeStyles,
  ...containerColorStyles,
});

export const contentStyles = StyleSheet.create({
  ...contentBaseStyles,
  ...contentSizeStyles,
  ...contentColorStyles,
});
