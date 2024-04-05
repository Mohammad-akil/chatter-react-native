import { memo, type FC } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { roomLive, type Room, type RoomOld, type RoomPrivacyOld } from '~/entities/Room';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import Stat from '~/ui/Stat';

import { getTimeFrom, getTimeTo } from '~/utils/formatDates';
import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';

const getPrivacyIcon = (privacy: RoomPrivacyOld) => {
  switch (privacy) {
    case 'private':
      return <Icon name='lock-closed' size={normalize(16)} color={colorPalette.warning400} />;

    case 'subscribers':
      return <Icon name='star' size={normalize(16)} color={colors.text.textBrand} />;

    default:
      return null;
  }
};

const getRoomStatusIcon = (room: Room) => {
  const { messages, started_at, ended_at, status } = room;
  // const { status } = roomLive;
  switch (status) {
    case 'active':
      return <Stat iconName='chatbubbles' count={messages} />;
    case 'scheduled':
      const timeTo = getTimeTo(started_at!);
      return <Stat iconName='time' time={timeTo} />;
    case 'ended':
      const timeFrom = getTimeFrom(ended_at!);
      return (
        <Typography type='label' size='small' color='warning400'>
          {timeFrom}
        </Typography>
      );
  }
};

type CardHeaderProps = {
  style?: StyleProp<ViewStyle>;
  room: Room;
};

const CardHeader: FC<CardHeaderProps> = ({ style, room }) => {
  const { subscribers, host } = room;
  return (
    <Flex style={style} gap={8} flexDirection='row' justifyContent='space-between'>
      <Flex flexDirection='row' gap={4} alignItems='center'>
        <Avatar size={24} borderRadius='minimal' url={host.avatar ?? null} />
        {host.verified && <Icon name='checkmark-circle' size={16} color={colorPalette.primary400} />}
        <Typography type='label' size='small' color='textDefault'>
          {host.first_name} {host.last_name}
        </Typography>
      </Flex>
      <Flex flexDirection='row' gap={8} alignItems='center'>
        <Flex flexDirection='row' gap={4} alignItems='center'>
          {/* {getPrivacyIcon(privacy)} */}
          <Stat iconName='person-circle-outline' count={subscribers} fractionalDigits={1} />
          {getRoomStatusIcon(room)}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(CardHeader);
