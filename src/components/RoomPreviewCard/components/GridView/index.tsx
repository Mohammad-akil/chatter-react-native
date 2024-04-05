import { type FC, useMemo, useState, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';

import { type Room, type RoomOld, roomLive } from '~/entities/Room';
import { User } from '~/entities/User';

import UserVideo from '~/components/UserVideo';
import IconButton from '~/ui/IconButton';
import NameTag from '~/ui/NameTag';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { chunkArray } from '~/utils';
import { normalize } from '~/utils/normalize';
import { useNavigation } from '@react-navigation/native';

export type RoomView = 'userWithoutCamera' | 'userWithCamera' | 'usersWithoutCamera' | 'usersWithCamera';

type GridViewProps = {
  style?: StyleProp<ViewStyle>;
  room: Room;
};

const GridView: FC<GridViewProps> = ({ style, room }) => {
  const { users } = roomLive;
  const { host } = room;

  const [roomView] = useState<RoomView>('userWithoutCamera');
  const { navigate } = useNavigation();

  const handleJoinRoom = (id: string) => navigate('RoomNavigator', { room_id: id, action_type: 'join' });

  const channelUsers = useMemo(() => {
    switch (roomView) {
      case 'userWithoutCamera':
        return (
          <Flex justifyContent='center' alignItems='center' flex={1} gap={8}>
            <Avatar url={host.avatar ?? null} size={120} />
            <NameTag isVerified={host.verified} option='sub' size='default'>
              {users[0].first_name} {users[0].last_name}
            </NameTag>
          </Flex>
        );
      case 'usersWithoutCamera':
        return (
          <Flex flex={1} gap={4}>
            {chunkArray(users, 2).map((row, rowIndex) => (
              <Flex key={rowIndex} flexDirection='row'>
                {row.map((user: any) => (
                  <Flex
                    style={styles.usersWithoutCameraItem}
                    key={user.id}
                    justifyContent='center'
                    alignItems='center'
                    gap={8}
                    flex={1}
                  >
                    <Avatar url={user.avatar ?? null} size={72} />
                    <NameTag isVerified={user.verified} option='sub' size='default'>
                      {user.first_name}
                    </NameTag>
                  </Flex>
                ))}
              </Flex>
            ))}
          </Flex>
        );
      case 'userWithCamera':
        return (
          <UserVideo
            isVerified={host.verified}
            avatar={host.avatar ?? null}
            size={253}
            name={host.first_name + ' ' + host.last_name}
          />
        );
      case 'usersWithCamera':
        return (
          <Flex style={styles.usersWithCamera} flex={1} gap={4}>
            {chunkArray(users, 2).map((row, rowIndex) => (
              <Flex key={rowIndex} flexDirection='row' gap={4}>
                {row.map((user: User) => (
                  <UserVideo
                    isVerified={user.verified}
                    key={user.id}
                    avatar={user.avatar ?? null}
                    size={124}
                    name={user.first_name}
                  />
                ))}
              </Flex>
            ))}
          </Flex>
        );
      default:
        return null;
    }
  }, [roomView, users, host]);

  return (
    <Flex style={style} flexDirection='row' alignItems='center' justifyContent='space-between' gap={32}>
      {channelUsers}
      <Flex justifyContent='flex-end' gap={11}>
        <IconButton type='ghost' size='3xl' iconName='share-outline' />
        <IconButton type='ghost' size='3xl' iconName='volume-mute-outline' />
        <IconButton size='3xl' iconName='chevron-forward' onPress={() => handleJoinRoom(room.id)} />
      </Flex>
    </Flex>
  );
};

export default memo(GridView);

const styles = StyleSheet.create({
  usersWithCamera: {
    borderTopLeftRadius: normalize(45),
    borderBottomLeftRadius: normalize(45),
    overflow: 'hidden',
  },

  usersWithoutCameraItem: {
    width: normalize(124),
    height: normalize(124),
  },
});
