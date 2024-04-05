import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.grey800,
    gap: 12,
  },
  title: {
    color: colorPalette.grey100,
  },
  description: {
    color: colorPalette.grey100,
    textAlign: 'center',
  },
});
