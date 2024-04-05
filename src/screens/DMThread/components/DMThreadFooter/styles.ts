import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  generalContainer: { paddingVertical: 8 },
  chatFooter: {
    backgroundColor: colorPalette.grey700,
    borderRadius: 6,
    paddingVertical: normalize(12),
  },
  imagesNavContainer: { paddingLeft: 6, paddingRight: normalize(16) },
  gifButton: { backgroundColor: colorPalette.grey100, paddingHorizontal: 6, borderRadius: 6 },
  gifButtonText: { fontSize: normalize(12), lineHeight: normalize(17) },
});
