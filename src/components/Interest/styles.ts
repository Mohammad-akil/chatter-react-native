import { StyleSheet } from 'react-native';
import { fonts } from '~/styles/fonts';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: normalize(12),
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.aeonik.regular,
    fontWeight: '400',
    fontSize: normalize(17),
    lineHeight: normalize(24),
  },
  icon: {
    marginLeft: 5,
  },
});
