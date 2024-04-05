import { Dispatch, SetStateAction, useCallback } from 'react';
import { Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from '~/entities/DirectMessages';

export const useImagePick = (
  setImageUriValue: Dispatch<SetStateAction<string | undefined>>,
  setImage: Dispatch<SetStateAction<Image | undefined>>,
) => {
  const handlePickImage = useCallback(async () => {
    const image = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1, includeBase64: true });
    if (image.didCancel) return;
    const assetUri = image.assets?.[0].uri;
    const assetName = image.assets?.[0].fileName;
    const assetType = image.assets?.[0].type;
    const assetWidth = image.assets?.[0].width;
    const assetHeight = image.assets?.[0].height;
    setImageUriValue(assetUri);

    const uploadUri = Platform.OS === 'ios' ? assetUri?.replace('file://', '') : assetUri;
    setImage({
      image: {
        uri: uploadUri,
        name: assetName,
        type: assetType,
      },
      dimensions: {
        width: assetWidth,
        height: assetHeight,
      },
    });
  }, [setImage, setImageUriValue]);

  return { handlePickImage };
};
