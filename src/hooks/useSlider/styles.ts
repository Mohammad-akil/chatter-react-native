import { StyleSheet } from 'react-native';
import { colorPalette, colors } from '~/styles/colors';

export const progress = StyleSheet.create({
  base: {
    height: 2,
    borderRadius: 6,
    flex: 1,
    backgroundColor: colorPalette.grey600_50,
  },
  active: {
    backgroundColor: colors.text.textDefault,
  },
});
