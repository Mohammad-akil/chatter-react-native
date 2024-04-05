import { StyleSheet } from 'react-native';
import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  header: {
    ...commonStyles.baseScreenPadding,
    paddingVertical: normalize(24),
  },
  contentScroll: {
    gap: normalize(24),
  },
  channelTabs: {
    flexGrow: 1,
    minHeight: normalize(350),
  },
});
