import { useEffect } from 'react';
import { GiphyDialog } from '@giphy/react-native-sdk';
import { api } from '~/api';

const useGifMessageLogic = (boxId: string) => {
  useEffect(() => {
    const onMediaSelectHandler = async (e: any) => {
      GiphyDialog.hide();
      const gifId = e.media.data.id;
      const gifRatio = e.media.aspectRatio;
      await api.directMessages.createDirectMessage(
        boxId,
        {
          data: `giphy:${gifId}`,
          aspect_ratio: gifRatio,
        },
        'gif',
      );
    };
    GiphyDialog.addListener('onMediaSelect', onMediaSelectHandler);

    return () => {
      GiphyDialog.removeAllListeners('onMediaSelect');
    };
  }, [boxId]);

  const handlePickGif = () => {
    GiphyDialog.configure({ theme: 'dark' });
    GiphyDialog.show();
  };

  return { handlePickGif };
};

export default useGifMessageLogic;
