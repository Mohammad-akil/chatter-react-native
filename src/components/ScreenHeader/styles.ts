import { StyleSheet } from 'react-native';
import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  wrapper: {
    paddingTop: normalize(20),
    paddingBottom: normalize(10),
    gap: normalize(12),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  button: {
    ...commonStyles.zeroPadding,
  },
});
