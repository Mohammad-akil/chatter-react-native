import { Dispatch, SetStateAction } from 'react';
import { Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ConversationImage } from '../screens/NewConversation/types';
export const uploadConversationImage = async (
  setImageUriValue: Dispatch<SetStateAction<string | undefined>>,
  setImage: Dispatch<SetStateAction<ConversationImage | undefined>>,
) => {
  const image = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, includeBase64: true });
  if (image.didCancel) return;
  const assetUri = image.assets?.[0].uri;
  const assetName = image.assets?.[0].fileName?.replace(/\.[^/.]+$/, '.png');
  const uploadUri = Platform.OS === 'ios' ? assetUri?.replace('file://', '') : assetUri;
  setImageUriValue(assetUri);
  setImage({
    uri: uploadUri,
    name: assetName,
    type: 'image/png',
  });
};
