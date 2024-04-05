import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followers: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(56),
    right: 0,
    backgroundColor: colorPalette.white_03,
    position: 'absolute',
    zIndex: 9999,
  },
});
