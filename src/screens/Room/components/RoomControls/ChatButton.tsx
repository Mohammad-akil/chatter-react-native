import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IconButton from '~/ui/IconButton';
import { useRecoilState } from 'recoil';
import { chatOpenedState } from '../../state/chatState';

type ChatButtonProps = {
  style?: StyleProp<ViewStyle>;
};

const ChatButton: FC<ChatButtonProps> = () => {
  const { navigate } = useNavigation();
  const [chatOpened, setChatOpened] = useRecoilState(chatOpenedState);

  const handleChat = useCallback(() => {
    if (!chatOpened) {
      navigate('RoomChat');
      setChatOpened(true);
    } else {
      navigate('Room');
      setChatOpened(false);
    }
  }, [navigate, chatOpened, setChatOpened]);

  return (
    <IconButton
      active={chatOpened}
      type='secondary'
      size='3xl'
      iconName='chatbubble-ellipses-outline'
      onPress={handleChat}
    />
  );
};

export default memo(ChatButton);
