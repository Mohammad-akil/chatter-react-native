import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  inputIOSContainer: {
    justifyContent: 'center',
    padding: normalize(10),
    paddingRight: normalize(26),
  },
  inputAndroidContainer: {
    justifyContent: 'center',
    paddingHorizontal: normalize(10),
    paddingRight: normalize(26),
  },
  placeholder: {
    color: colorPalette.grey50,
    ...typography.body.medium,
  },
  inputIOS: {
    color: colorPalette.grey50,
    ...typography.body.medium,
    paddingRight: 6,
  },
  iconContainer: {
    padding: 6,
    paddingRight: normalize(10),
  },
  inputAndroid: {
    color: colorPalette.grey50,
    ...typography.body.medium,
    paddingRight: normalize(10),
    paddingVertical: normalize(10),
  },
  icon: { marginTop: 3 },
});
