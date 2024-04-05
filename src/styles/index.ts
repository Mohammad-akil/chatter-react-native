import { StyleSheet } from 'react-native';
import { colorPalette } from './colors';
import { normalize } from '~/utils/normalize';
import { fonts } from './fonts';

export const commonStyles = StyleSheet.create({
  baseSafeArea: {
    flexGrow: 1,
    backgroundColor: colorPalette.grey850,
  },
  baseScrollView: {
    paddingHorizontal: normalize(20),
    flexGrow: 1,
  },
  baseScreenPadding: {
    paddingHorizontal: normalize(20),
  },
  baseScreen: {
    gap: normalize(24),
  },
  baseFooter: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(20),
    paddingTop: normalize(20),
  },
  buttonBottom: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: normalize(45),
  },
  // FLEX
  flexFull: {
    flex: 1,
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ADDITIONAL
  zeroPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  aeonikRegular: {
    fontFamily: fonts.aeonik.regular,
  },
  fullHeight: {
    height: '100%',
  },
});

export const baseScreenLayout = StyleSheet.create({
  baseSafeArea: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: colorPalette.grey850,
  },
  scrollContent: {
    paddingTop: normalize(30),
  },
  scrollComponent: {
    overflow: 'hidden',
  },
});

export const commonPopover = StyleSheet.create({
  base: {
    borderRadius: 6,
  },
  noBackground: {
    backgroundColor: 'transparent',
  },
  arrow: {
    width: 0,
    height: 0,
  },
});
