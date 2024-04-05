import dayjs from 'dayjs';
import { type FC, memo } from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import type { NotificationProps } from './types';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

function hasNumber(myString: string) {
  return /\d/.test(myString);
}

const Notification: FC<NotificationProps> = ({ avatar, date, payload, type, time }) => {
  const navigation = useNavigation();
  const timePassed = dayjs(time, { format: 'short' }).fromNow(true);

  switch (type) {
    case 'LIVE_ROOM':
      return (
        <Flex flexDirection='row' gap={12} alignItems='flex-start'>
          <Avatar size={40} url={avatar} />
          <Text style={styles.text}>
            <Text style={styles.boldText}>{payload.companyName}</Text> has a live room:{' '}
            <Text style={styles.boldText}>"{payload.roomName}"</Text>{' '}
            <Text style={styles.timePassedTimeText}> {timePassed}</Text>
          </Text>
          <Button style={styles.button} text='Join now' size='sm' />
        </Flex>
      );
    case 'STARTED_FOLLOWING':
      return (
        <Flex flexDirection='row' gap={12} alignItems='flex-start'>
          <TouchableOpacity onPress={() => navigation.navigate('PreviewProfile', { user_id: payload.userId })}>
            <Avatar size={40} url={avatar} />
          </TouchableOpacity>
          <Text style={styles.text}>
            <Text style={styles.boldText}>{payload.userName} </Text>
            started following you. {'\n'}
            <Text style={styles.timePassedTimeText}>{timePassed} ago</Text>
          </Text>

          <Button
            type='ghost'
            style={styles.button}
            text={payload.isFollowing ? 'Unfollow' : 'Follow back'}
            size='sm'
          />
        </Flex>
      );
    // case 'FOLLOWING_GROUP':
    //   return (
    //     <Flex flexDirection='row' gap={12} alignItems='flex-start'>
    //       <TouchableOpacity onPress={() => navigation.navigate('PreviewProfile', { user_id: payload.mainUserId })}>
    //         <Avatar size={40} url={payload.mainAvatar} />
    //       </TouchableOpacity>
    //       <Text style={styles.text}>
    //         <Text style={styles.boldText}>{payload.mainUserName} </Text> and {payload.userIds.length} others started
    //         following you. <Text style={styles.timePassedTimeText}>{timePassed}</Text>
    //       </Text>
    //     </Flex>
    //   );
    case 'ROOM_INVITATION':
      return (
        <Flex flex={1} gap={12} flexDirection='row' alignItems='flex-start'>
          <Flex flexDirection='row' flex={1} gap={10} alignItems='flex-start'>
            <Avatar size={40} url={avatar} />
            <Text style={styles.text}>
              <Text style={styles.boldText}>{payload.userName}</Text> invited you to an upcoming room:{' '}
              <Text style={styles.boldText}>"Deep Blue Dialogue: Saving Our Oceans"</Text>{' '}
              <Text style={styles.timePassedTimeText}>{timePassed}</Text>
            </Text>
          </Flex>
          <Flex gap={10} flexDirection='column' alignItems='flex-end'>
            <Text style={styles.remainingTimeText}>{dayjs(payload.scheduleDate).fromNow(true)}</Text>
            <Button type='ghost' text="RSVP'd" size='sm'></Button>
          </Flex>
        </Flex>
      );
    case 'ROOM_START_FOLLOWING':
      return (
        <Flex flex={1} gap={12} flexDirection='row' alignItems='flex-start'>
          <Flex flexDirection='row' flex={1} gap={10} alignItems='flex-start'>
            <Avatar size={40} url={payload.host.avatar} />
            <Text style={styles.text}>
              <Text style={styles.boldText}>{payload.host.first_name}</Text> just started a room:{' '}
              <Text style={styles.boldText}>{payload.roomName}</Text>{' '}
              <Text style={styles.timePassedTimeText}>{timePassed} ago</Text>
            </Text>
          </Flex>
          <Flex gap={10} flexDirection='column' alignItems='flex-end'>
            <Button
              type='ghost'
              text='Join'
              size='sm'
              onPress={() => navigation.navigate('RoomNavigator', { room_id: payload.roomId, action_type: 'join' })}
            ></Button>
          </Flex>
        </Flex>
      );
    case 'ROOM_SCHEDULED':
      return (
        <Flex flex={1} gap={12} flexDirection='row' alignItems='flex-start'>
          <Flex flexDirection='row' flex={1} gap={10} alignItems='flex-start'>
            <Avatar size={40} url={avatar} />
            <Text style={styles.text}>
              <Text style={styles.boldText}>{payload.companyName}</Text> has scheduled an upcoming room:{' '}
              <Text style={styles.boldText}>"Deep Blue Dialogue: Saving Our Oceans"</Text>{' '}
              <Text style={styles.timePassedTimeText}>{timePassed}</Text>
            </Text>
          </Flex>
          <Flex gap={10} flexDirection='column' alignItems='flex-end'>
            <Text style={styles.remainingTimeText}>{dayjs(payload.scheduleDate).fromNow(true)}</Text>
            <Button type='ghost' text='RSVP' size='sm'></Button>
          </Flex>
        </Flex>
      );
    case 'CONVERSATION_RESPONSE':
      return (
        <Flex flexDirection='row' gap={12} alignItems='flex-start'>
          <Avatar size={40} url={avatar} />
          <Text style={[styles.text, styles.conversationResponseText]}>
            <Text style={styles.boldText}>{payload.userName}</Text> responded to your conversation:{' '}
            <Text style={styles.boldText}>"{payload.conversationName}"</Text>{' '}
            <Text style={styles.timePassedTimeText}>{timePassed}</Text>
          </Text>
        </Flex>
      );
    default:
      return null;
  }
};

export default memo(Notification);
