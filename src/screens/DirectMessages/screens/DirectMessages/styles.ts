import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.baseScreenPadding,
    paddingBottom: normalize(100),
  },
  scrollViewPadding: {
    paddingBottom: normalize(175),
  },
});
