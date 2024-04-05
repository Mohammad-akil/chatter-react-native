import { useEffect } from 'react';
import { GiphyDialog } from '@giphy/react-native-sdk';
import { client } from '~/services/websocket';
import { useRecoilValue } from 'recoil';
import { state } from '../state/roomState';

const useGifMessage = () => {
  const roomDetails = useRecoilValue(state.roomDetailsState);

  useEffect(() => {
    const onMediaSelectHandler = (e: any) => {
      GiphyDialog.hide();
      const gifId = e.media.data.id;
      if (roomDetails?.id) {
        client.publish(`room/${roomDetails.id}/chat/send`, {
          type: 'gif',
          content: `giphy:${gifId}`,
        });
      }
    };

    GiphyDialog.addListener('onMediaSelect', onMediaSelectHandler);

    return () => {
      GiphyDialog.removeAllListeners('onMediaSelect');
    };
  }, [roomDetails]);

  const handlePickGif = () => {
    GiphyDialog.configure({ theme: 'dark' });
    GiphyDialog.show();
  };

  return { handlePickGif };
};

export default useGifMessage;
