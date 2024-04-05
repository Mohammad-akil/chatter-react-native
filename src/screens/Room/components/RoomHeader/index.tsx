import { memo, type FC, useCallback } from 'react';
import { StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { Room } from '~/entities/Room';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import RecordIcon from '~/ui/RecordIcon';
import Skeleton from '~/ui/Skeleton';
import Avatar from '~/ui/Avatar';

import RoomMenu from '../RoomMenu';

import { roomData as staticRoomData } from '../../state/staticData';
import { colorPalette, colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type RoomHeaderProps = {
  roomData: Room | null;
  roomBeingRecorded: boolean;
  goBack: () => void;
  partcipantsCount: number;
  style?: StyleProp<ViewStyle>;
};

const RoomHeader: FC<RoomHeaderProps> = ({ roomData, goBack, roomBeingRecorded, partcipantsCount, style }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const goToOwnerProfile = useCallback(() => {
    if (roomData?.user_owned_room && roomData.host_id) {
      navigate('PreviewProfile', { user_id: roomData.host_id });
    }
  }, [roomData, navigate]);

  if (!roomData) {
    return (
      <Flex style={styles.base} gap={4}>
        <Flex gap={4} flexDirection='row'>
          <Flex flex={1}>
            <Skeleton width={190} height={44} borderRadius={6} />
          </Flex>
          <Flex alignItems='center' gap={8} flexDirection='row'>
            <Skeleton width={44} height={44} borderRadius={44} />
            <Skeleton width={44} height={44} borderRadius={44} />
            <Skeleton width={44} height={44} borderRadius={44} />
          </Flex>
        </Flex>
        <>
          <Flex gap={4} flexDirection='row' alignItems='center'>
            <Skeleton width={24} height={24} borderRadius={6} />
            <Skeleton width={160} height={24} borderRadius={6} />
          </Flex>
          <Flex flexDirection='row' alignItems='center' gap={4}>
            <Skeleton height={29} width={85} borderRadius={6} />
            <Skeleton height={29} width={85} borderRadius={6} />
          </Flex>
        </>
      </Flex>
    );
  }

  return (
    <AnimatedFlex entering={FadeIn.duration(200)} style={[styles.base, style]} gap={10}>
      <Flex gap={4} style={{ zIndex: 1 }} alignItems='center' flexDirection='row'>
        <Flex flex={1}>
          <Typography type='headline' size='small'>
            {roomData.title}
          </Typography>
        </Flex>
        <Flex alignItems='center' gap={8} flexDirection='row'>
          <RoomMenu />
          <IconButton type='secondary' size='xl' iconName='share-outline' />
          <IconButton type='secondary' size='xl' iconName='remove' onPress={goBack} />
        </Flex>
      </Flex>
      <Flex gap={4}>
        <TouchableOpacity onPress={goToOwnerProfile}>
          <Flex style={{ zIndex: 0 }} gap={4} flexDirection='row' alignItems='center'>
            <Avatar size={24} url={roomData.host.avatar ?? null} borderRadius='minimal' />
            <Typography type='label' size='small'>
              {roomData.host.first_name} {roomData.host.last_name}
            </Typography>

            {roomBeingRecorded && <RecordIcon style={styles.recordIcon} size={12} />}
          </Flex>
        </TouchableOpacity>
        <Flex flexDirection='row' alignItems='center' gap={8} style={styles.statsContainer}>
          <Flex flexDirection='row' alignItems='center' gap={6}>
            <Icon name='person' size={14} color={colors.text.textDefault} />
            <Typography type='body' size='semibold'>
              {staticRoomData.subscribersCount}
            </Typography>
          </Flex>
          <View style={styles.circleDivider} />
          <Typography type='body' size='semibold' color='tertiary'>
            {partcipantsCount} {t('room.hereNow')}
          </Typography>
        </Flex>
      </Flex>
    </AnimatedFlex>
  );
};

export default memo(RoomHeader);

const styles = StyleSheet.create({
  base: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
    backgroundColor: colorPalette.grey850,
  },
  statsContainer: {
    paddingVertical: normalize(10),
  },
  circleDivider: {
    width: 6,
    height: 6,
    borderRadius: 100,
    backgroundColor: colors.text.textLabel,
  },
  recordIcon: {
    paddingHorizontal: 8,
  },
});
