import { StyleSheet } from 'react-native';
import { fonts } from '~/styles/fonts';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
  },
  text: {
    color: '#D0D0D0',
    fontFamily: fonts.lato.regular,
    flex: 1,
  },
  boldText: {
    color: 'white',
    fontFamily: fonts.lato.bold,
  },
  timePassedTimeText: {
    fontSize: normalize(12),
    color: '#D0D0D0',
    fontFamily: fonts.lato.regular,
  },
  remainingTimeText: {
    fontFamily: fonts.lato.regular,
    color: '#D0D0D0',
  },
  conversationResponseText: {
    maxWidth: normalize(208),
  },
});
