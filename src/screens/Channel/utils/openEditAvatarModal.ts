import { Platform, ActionSheetIOS } from 'react-native';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';
import { uploadImage } from './uploadImage';
import { Channel } from '~/entities/Channel';
import { getChannel } from './getChannel';
import { SetterOrUpdater } from 'recoil';
import { api } from '~/api';
import { TFunction } from 'i18next';

const openEditAvatarModal = (
  selectedChannelId: string,
  openModal: () => void,
  typeOfImage: 'avatar' | 'banner',
  setChannel: SetterOrUpdater<Channel>,
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
            await api.channel.deleteAvatarOrBanner(selectedChannelId, typeOfImage);
            if (typeOfImage === 'avatar') {
              await api.auth.me();
            }
            getChannel(selectedChannelId, setChannel);
          } catch {
            Toast.show({
              type: 'error',
              text1: 'Something is wrong. Try again',
            } as CustomToastProps);
          }
        } else if (buttonIndex === 2) {
          try {
            const res = uploadImage(selectedChannelId, typeOfImage);
            res.then(async () => {
              getChannel(selectedChannelId, setChannel);
              if (typeOfImage === 'avatar') {
                await api.auth.me();
              }
            });
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
    openModal();
  }
};

export default openEditAvatarModal;
