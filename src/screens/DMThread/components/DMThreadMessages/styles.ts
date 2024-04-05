import { StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

export const styles = StyleSheet.create({
  usernameContainer: {
    paddingHorizontal: 6,
  },
  emptyContainer: { width: normalize(40), height: normalize(30) },
  generalImageStyle: { borderRadius: 10, alignSelf: 'center' },
  usernameStyle: { fontWeight: '500' },
  messageContainer: { paddingTop: 4 },
  textWithImageContainer: { paddingVertical: 6, paddingHorizontal: normalize(10) },
  userAvatarContainer: { width: normalize(40), height: normalize(10) },
  userAvatar: { position: 'absolute', top: 0, justifyContent: 'center' },
  userMessage: { backgroundColor: colorPalette.success450 },
});
