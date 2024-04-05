import { Dispatch, SetStateAction } from 'react';
import { Platform, ActionSheetIOS } from 'react-native';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';
import { api } from '~/api';
import { TFunction } from 'i18next';
import { uploadProfileAvatar } from './uploadProfileAvatar';

export const openProfileAvatarModal = (
  refresh: () => Promise<void>,
  setIsModalOpen: Dispatch<SetStateAction<boolean>>,
  t: TFunction<'en', undefined>,
) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('common.cancel'), t('common.remove'), t('common.choosePhoto')],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          try {
            await api.profile.deleteAvatar();
            refresh();
          } catch {
            Toast.show({
              type: 'error',
              text1: 'Something is wrong. Try again',
            } as CustomToastProps);
          }
        } else if (buttonIndex === 2) {
          try {
            await uploadProfileAvatar();
            refresh();
          } catch {
            Toast.show({
              type: 'error',
              text1: 'Something is wrong. Try again',
            } as CustomToastProps);
          }
        }
      },
    );
  } else {
    setIsModalOpen(true);
  }
};

export default openProfileAvatarModal;
