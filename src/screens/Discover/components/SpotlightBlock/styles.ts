import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  wrapper: {
    padding: 8,
  },
  name: {
    maxWidth: normalize(190),
  },
  description: {
    maxWidth: normalize(240),
  },
  date: {
    maxWidth: normalize(120),
  },
  actions: {
    maxWidth: normalize(150),
  },
});
