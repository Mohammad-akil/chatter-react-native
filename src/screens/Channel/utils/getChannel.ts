import Toast from 'react-native-toast-message';
import { SetterOrUpdater } from 'recoil';
import { api } from '~/api';
import { Channel } from '~/entities/Channel';
import { CustomToastProps } from '~/ui/Toast/types';

export const getChannel = async (id: string, setChannel: SetterOrUpdater<Channel>) => {
  try {
    const data = await api.channel.getChannel(id);
    setChannel(data.channel);
  } catch {
    Toast.show({
      type: 'error',
      text1: 'Something is wrong. Try again',
    } as CustomToastProps);
  }
};
