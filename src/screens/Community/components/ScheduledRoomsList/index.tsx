import { useNavigation } from '@react-navigation/native';
import { FC, memo } from 'react';
import { Pressable } from 'react-native';
import RoomPreviewCard from '~/components/RoomPreviewCard';
import { Room } from '~/entities/Room';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';

interface IScheduledRoomsList {
  rooms: Room[];
}
const ScheduledRoomsList: FC<IScheduledRoomsList> = ({ rooms }) => {
  const { navigate } = useNavigation();

  return (
    <Flex gap={normalize(10)}>
      {rooms.slice(0, 1).map((room) => (
        <Pressable key={room.id} onPress={() => navigate('RoomNavigator', { room_id: room.id, action_type: 'join' })}>
          <RoomPreviewCard key={room.id} room={room} isList={true} />
        </Pressable>
      ))}
    </Flex>
  );
};

export default memo(ScheduledRoomsList);
