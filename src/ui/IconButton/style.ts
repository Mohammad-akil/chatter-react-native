import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { type ColorStyleOptions, type SizeStyleOptions } from './types';

import { colorPalette, colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

const containerRadiusStyles = {
  full: {
    borderRadius: normalize(100),
  },
  minimal: {
    borderRadius: 6,
  },
};

const containerSizeStyles: SizeStyleOptions<ViewStyle> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  md: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
  },
  lg: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
  },
  xl: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
  },
  '2xl': {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
  },
  '3xl': {
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(24),
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'secondary-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'secondary-active': {
    backgroundColor: colors.surface.buttonDefaultHover,
    borderColor: colors.border.borderPrimary,
  },
  'secondary-disabled': {
    backgroundColor: colors.surface.buttonDefaultDisabled,
  },
  // Conversation-record
  'conversation-record': {
    backgroundColor: colors.surface.buttonPrimaryNormal,
    borderColor: colors.surface.buttonPrimaryNormal,
  },
  'conversation-record-pressed': {
    backgroundColor: colors.surface.buttonPrimaryNormal,
    borderWidth: 2,
    paddingVertical: normalize(22),
    paddingHorizontal: normalize(22),
    borderColor: colorPalette.primary300,
  },
  'conversation-record-disabled': {
    backgroundColor: colors.surface.buttonPrimaryDisabled,
  },
  // Delete-control
  'delete-control': {
    backgroundColor: colorPalette.error500,
  },
  'delete-control-pressed': {
    backgroundColor: colorPalette.error600,
  },
  'delete-control-disabled': {
    backgroundColor: colorPalette.error700,
  },
  // Room-control
  'room-control': {
    backgroundColor: colors.surface.buttonDefaultNormal,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'room-control-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'room-control-active': {
    backgroundColor: colors.surface.buttonDefaultHover,
    borderColor: colors.border.borderPrimary,
  },
  'room-control-disabled': {
    backgroundColor: colors.surface.buttonDefaultDisabled,
  },
  'room-control-requested': {
    backgroundColor: colors.surface.buttonDefaultHover,
    borderColor: colors.text.textSuccess,
    borderWidth: 1,
  },
  'room-control-on': {
    backgroundColor: colors.surface.buttonDefaultHover,
    borderColor: colorPalette.primary500,
    borderWidth: 1,
  },
  // Chat
  send: {
    height: normalize(42),

    paddingVertical: 0,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.blue500,
  },
  'send-pressed': {
    backgroundColor: colorPalette.blue600,
  },
  'send-disabled': {
    opacity: 0.5,
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
  //Room-list
  'room-list': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },
  'room-list-pressed': {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: colors.border.borderPrimary,
  },
  'room-list-disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: colors.border.borderDisabled,
  },

  // Delete
  delete: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'delete-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'delete-disabled': {},

  // Text
  text: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'text-pressed': {
    backgroundColor: colors.surface.buttonDefaultPressed,
  },
  'text-disabled': {
    opacity: 0.5,
  },
  'text-active': {
    backgroundColor: colors.surface.buttonDefaultPressed,
    borderColor: colors.border.borderPrimary,
  },
  'text-inverted': {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  'text-inverted-pressed': {
    backgroundColor: colorPalette.grey200,
  },
  'text-inverted-disabled': {
    backgroundColor: 'transparent',
  },
  'text-inverted-active': {},

  //TOAST NORMAL
  'toast-normal': {
    backgroundColor: 'transparent',
  },

  // TOAST ERROR
  'toast-error': {
    backgroundColor: 'transparent',
  },

  //RED
  red: {
    backgroundColor: colorPalette.error500,
  },

  'red-pressed': {
    backgroundColor: colorPalette.error600,
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
  'secondary-active': {
    color: colors.text.textDefault,
  },
  'secondary-disabled': {
    color: colors.text.textDisabled,
  },
  // ConversationRecord
  'conversation-record': {
    color: colors.text.textDefault,
  },
  'conversation-record-pressed': {
    color: colors.text.textDefault,
  },
  'conversation-record-disabled': {
    color: colors.text.textDisabled,
  },
  // Delete-control
  'delete-control': {
    color: colors.text.textDefault,
  },
  'delete-control-pressed': {
    color: colors.text.textDefault,
  },
  'delete-control-disabled': {
    color: colors.text.textDisabled,
  },
  // Room-control
  'room-control': {
    color: colors.text.textDefault,
  },
  'room-control-pressed': {
    color: colors.text.textDefault,
  },
  'room-control-active': {
    color: colors.text.textDefault,
  },
  'room-control-disabled': {
    color: colors.text.textDisabled,
  },
  'room-control-requested': {
    color: colors.text.textDefault,
  },
  'room-control-on': {
    color: colorPalette.primary500,
  },
  send: {
    color: colors.text.textDefault,
  },
  'send-pressed': {
    color: colors.text.textDefault,
  },
  'send-disabled': {
    color: colors.text.textDefault,
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
  //Room-list
  'room-list': {
    color: colors.text.textDefault,
  },
  'room-list-pressed': {
    color: colors.text.textDefault,
  },
  'room-list-disabled': {
    color: colors.text.textDisabled,
  },
  //Delete
  delete: {
    color: colors.text.textDelete,
  },
  'delete-pressed': {
    color: colors.text.textError,
  },
  'delete-disabled': {
    color: colors.text.textDisabled,
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
  'text-active': {
    color: colors.text.textDefault,
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
  'text-inverted-active': {
    color: colorPalette.grey900,
  },

  //TOAST NORMAL
  'toast-normal': {
    color: colors.text.textDefault,
  },

  'toast-normal-pressed': {
    color: colorPalette.primary800,
  },

  // TOAST ERROR
  'toast-error': {
    color: colorPalette.grey900,
  },

  'toast-error-pressed': {
    color: colorPalette.error700,
  },

  //RED
  red: {
    color: colorPalette.white,
  },

  'red-pressed': {
    color: colorPalette.white,
  },
};

export const iconSize: SizeStyleOptions<number> = {
  sm: normalize(16),
  md: normalize(20),
  lg: normalize(24),
  xl: normalize(20),
  '2xl': normalize(24),
  '3xl': normalize(20),
};

export const containerStyles = StyleSheet.create({
  ...containerRadiusStyles,
  ...containerSizeStyles,
  ...containerColorStyles,
});

export const contentStyles = StyleSheet.create({
  ...contentColorStyles,
});

export const badgeStyle = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: normalize(20),
    height: normalize(20),
    backgroundColor: colorPalette.error500,
    borderRadius: normalize(360),
    right: 0,
    top: 0,
    zIndex: 999,
  },
});
