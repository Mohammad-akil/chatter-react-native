import { type TextStyle } from 'react-native';
import { normalize } from '~/utils/normalize';
import { fonts } from './fonts';

type TypographyStyles = {
  fontFamily: TextStyle['fontFamily'];
  fontSize: TextStyle['fontSize'];
  lineHeight: TextStyle['lineHeight'];
  fontWeight: TextStyle['fontWeight'];
};

export type Base = 'large' | 'medium' | 'small';
export type Display = Base | 'light';
export type Headline = Base | 'light' | 'default';
export type Body = Base | 'semibold' | 'default';

const display: Record<Display, TypographyStyles> = {
  large: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(60),
    lineHeight: normalize(60),
    fontWeight: '300',
  },
  medium: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(48),
    lineHeight: normalize(48),
    fontWeight: '400',
  },
  small: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(32),
    lineHeight: normalize(40),
    fontWeight: '400',
  },
  light: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(28),
    lineHeight: normalize(32),
    fontWeight: '300',
  },
} as const;

const headline: Record<Headline, TypographyStyles> = {
  large: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(28),
    lineHeight: normalize(34),
    fontWeight: '400',
  },
  medium: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(24),
    lineHeight: normalize(32),
    fontWeight: '400',
  },
  small: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(20),
    lineHeight: normalize(24),
    fontWeight: '400',
  },
  default: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(18),
    lineHeight: normalize(24),
    fontWeight: '400',
  },
  light: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(16),
    lineHeight: normalize(16),
    fontWeight: '400',
  },
};

const label: Record<Base, TypographyStyles> = {
  large: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(18),
    lineHeight: normalize(24),
    fontWeight: '400',
  },
  medium: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(16),
    lineHeight: normalize(20),
    fontWeight: '500',
  },
  small: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(14),
    lineHeight: normalize(18),
    fontWeight: '400',
  },
} as const;

const body: Record<Body, TypographyStyles> = {
  large: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(18),
    lineHeight: normalize(24),
    fontWeight: '400',
  },
  medium: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(16),
    lineHeight: normalize(20),
    fontWeight: '500',
  },
  semibold: {
    fontFamily: fonts.lato.semiBold,
    fontSize: normalize(14),
    lineHeight: normalize(16),
    fontWeight: '600',
  },
  default: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(14),
    lineHeight: normalize(18),
    fontWeight: '400',
  },
  small: {
    fontFamily: fonts.aeonik.regular,
    fontSize: normalize(12),
    lineHeight: normalize(14),
    fontWeight: '400',
  },
} as const;

export const typography = {
  display,
  headline,
  label,
  body,
};
