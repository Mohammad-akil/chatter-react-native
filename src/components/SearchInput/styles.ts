import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  searchIcon: {
    position: 'absolute',
    left: normalize(16),
    zIndex: 1,
  },
  inputContainer: {
    paddingLeft: normalize(48),
    backgroundColor: '#1F1C19',
    borderRadius: 360,
  },
  inputWrapper: {
    justifyContent: 'center',
  },
});
