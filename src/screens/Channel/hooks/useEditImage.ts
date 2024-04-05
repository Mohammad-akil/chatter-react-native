import { Dispatch, SetStateAction, useCallback } from 'react';
import { uploadImage } from '../utils/uploadImage';
import { getChannel } from '../utils/getChannel';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { channelState, typeOfUploadImage } from '../state';

type UseEditImageParams = {
  selectedChannelId: string;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function useEditImage({ selectedChannelId, setModalIsOpen }: UseEditImageParams) {
  const typeOfImage = useRecoilValue(typeOfUploadImage);
  const setChannel = useSetRecoilState(channelState);
  const chooseImage = useCallback(async () => {
    try {
      const res = uploadImage(selectedChannelId, typeOfImage);
      res.then(async () => {
        getChannel(selectedChannelId, setChannel);
        if (typeOfImage === 'avatar') {
          await api.auth.me();
        }
      });
      setModalIsOpen(false);
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomToastProps);
    }
  }, [selectedChannelId, setChannel, typeOfImage, setModalIsOpen]);

  const removeImage = useCallback(async () => {
    try {
      setModalIsOpen(false);
      await api.channel.deleteAvatarOrBanner(selectedChannelId, typeOfImage);
      if (typeOfImage === 'avatar') {
        await api.auth.me();
      }
      getChannel(selectedChannelId, setChannel);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomToastProps);
    }
  }, [selectedChannelId, setChannel, typeOfImage, setModalIsOpen]);

  return {
    chooseImage,
    removeImage,
  };
}
