import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';
import { commonStyles, baseScreenLayout } from '~/styles';

export const styles = StyleSheet.create({
  formContainer: {
    marginTop: normalize(24),
  },
  scrollContentContainer: {
    ...baseScreenLayout.scrollContent,
    ...commonStyles.baseScreenPadding,
    paddingBottom: normalize(100),
  },
});
