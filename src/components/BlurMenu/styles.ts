import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  wrapper: {
    opacity: 0.99,
  },
  tabsContainer: {
    padding: 4,
    gap: normalize(24),
  },
  selectedTabStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.primary400,
  },
  tab: {
    paddingVertical: 4,
  },
});
