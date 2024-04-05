import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  wrapper: {
    gap: normalize(24),
    borderBottomWidth: 0.25,
    borderColor: colors.text.textSecondary,
    paddingVertical: normalize(24),
    paddingHorizontal: normalize(20),
  },
  title: {
    fontFamily: fonts.aeonik.regular,
  },
});
