import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';
import { typography } from '~/styles/typography';
import { normalize } from '~/utils/normalize';

export const channelStyles = StyleSheet.create({
  tabView: {
    height: '100%',
  },
  tabBar: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    ...typography.label.large,
    fontFamily: fonts.aeonik.regular,
    textTransform: 'capitalize',
  },
  indicator: {
    backgroundColor: colors.text.textBrand,
  },
  tabContent: {
    paddingTop: normalize(24),
    gap: normalize(24),
  },
  tabActionButton: {
    width: '100%',
    paddingVertical: normalize(20),
  },
});
