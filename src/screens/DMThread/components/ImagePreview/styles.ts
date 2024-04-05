import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  wrapper: {
    maxHeight: normalize(100),
    maxWidth: '100%',
  },
  previewImage: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'flex-end',
  },
  remove: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(10),
  },
});
