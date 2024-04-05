import { StyleSheet } from 'react-native';
import { fonts } from '~/styles/fonts';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  wrapper: {
    gap: normalize(16),
  },
  aeonikText: {
    fontFamily: fonts.aeonik.regular,
  },
  leaders: {
    gap: 8,
    marginTop: normalize(10),
  },
});
