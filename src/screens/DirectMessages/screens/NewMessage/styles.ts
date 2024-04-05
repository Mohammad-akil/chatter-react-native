import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

export const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: normalize(40),
    paddingHorizontal: normalize(20),
  },
  inputContainer: {
    paddingBottom: normalize(24),
    paddingHorizontal: normalize(20),
  },
  checkboxContainer: {
    padding: normalize(8),
  },
  conversationPadding: {
    padding: normalize(4),
  },
  listContainer: {
    ...commonStyles.baseScreenPadding,
    paddingBottom: normalize(175),
  },
  conversationContainer: {
    paddingBottom: normalize(24),
  },
});
