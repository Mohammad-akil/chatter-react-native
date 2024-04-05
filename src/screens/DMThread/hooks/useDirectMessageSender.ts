import Toast from 'react-native-toast-message';
import { api } from '~/api';

export const useDirectMessageSender = (textInputValue: string, imageUriValue: string | undefined) => {
  const sendMessage = async (chatId: string, data: any) => {
    try {
      if (!textInputValue) {
        const formData = new FormData();
        formData.append('width', data.dimensions.width);
        formData.append('height', data.dimensions.height);
        formData.append('content', data.image);

        await api.directMessages.createDirectMessage(chatId, formData, 'image');
      } else if (textInputValue && !imageUriValue) {
        await api.directMessages.createDirectMessage(chatId, textInputValue.trim(), 'text');
      } else {
        const formData = new FormData();

        formData.append('text', textInputValue.trim());
        formData.append('width', data.dimensions.width);
        formData.append('height', data.dimensions.height);
        formData.append('content', data.image);

        await api.directMessages.createDirectMessage(chatId, formData, 'imageText');
      }
    } catch (error) {
      console.error('Error sending direct message:', error);
      Toast.show({
        text1: 'Somethting is wrong. Try again',
        type: 'error',
      });
    }
  };

  return { sendMessage };
};

export default useDirectMessageSender;
