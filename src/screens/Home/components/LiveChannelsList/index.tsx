import { type FC, memo } from 'react';

import type { Room } from '~/entities/Room';

import RoomPreviewCard from '~/components/RoomPreviewCard';
import Flex from '~/ui/Flex';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type LiveRoomListProps = {
  rooms: Room[];
};

export const LiveRoomList: FC<LiveRoomListProps> = memo(({ rooms }) => {
  const { navigate } = useNavigation();
  return (
    <Flex gap={8}>
      {rooms.map((room) => (
        <Pressable key={room.id} onPress={() => navigate('RoomNavigator', { room_id: room.id, action_type: 'join' })}>
          <RoomPreviewCard key={room.id} room={room} isList={true} />
        </Pressable>
      ))}
    </Flex>
  );
});
