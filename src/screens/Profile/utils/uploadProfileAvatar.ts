import { Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { api } from '~/api';

export const uploadProfileAvatar = async () => {
  const image = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1, includeBase64: true });
  if (image.didCancel) return;
  const assetUri = image.assets?.[0].uri;
  const assetName = image.assets?.[0].fileName;
  const assetType = image.assets?.[0].type;

  const uploadUri = Platform.OS === 'ios' ? assetUri?.replace('file://', '') : assetUri;

  const formData = new FormData();
  formData.append('avatar', {
    uri: uploadUri,
    name: assetName,
    type: assetType,
  });
  const data = await api.profile.uploadAvatar(formData);
  if (!data.success) {
    Toast.show({
      type: 'error',
      text1: data.error,
    });
    return;
  }
  return;
};
