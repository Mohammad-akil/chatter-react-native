import { type FC, memo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { roomLive, Room } from '~/entities/Room';

import IconButton from '~/ui/IconButton';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

type ListViewProps = {
  style?: StyleProp<ViewStyle>;
  room: Room;
};

const ListView: FC<ListViewProps> = ({ style, room }) => {
  const { host } = room;
  return (
    <Flex style={style} alignSelf='flex-start' flexDirection='row' gap={4}>
      {roomLive.status === 'live' ? (
        <Flex justifyContent='center' alignItems='center' flexDirection='row'>
          <Avatar url={host.avatar ?? null} size={70} style={avatarStyle.avatar} />
          <IconButton type='room-list' size='3xl' iconName='volume-mute-outline' />
        </Flex>
      ) : (
        <Avatar url={host.avatar ?? null} borderRadius='minimal' size={120} />
      )}
    </Flex>
  );
};
const avatarStyle = StyleSheet.create({
  avatar: { position: 'absolute', left: 0, right: 0 },
});

export default memo(ListView);
