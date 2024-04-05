import { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RoomOld, roomUpcoming } from '~/entities/Room';

import RoomPreviewCard from '~/components/RoomPreviewCard';
import ScreenHeader from '~/components/ScreenHeader';
import SharePopup from '~/components/SharePopup';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { baseScreenLayout, commonStyles } from '~/styles';
import { useRecoilValue } from 'recoil';
import { roomState } from '../state';
import { useTranslation } from 'react-i18next';

const RoomScheduled = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const [showShare, setShowShare] = useState(false);
  const roomData = useRecoilValue(roomState);

  const openSharePopup = useCallback(() => {
    setShowShare(true);
  }, []);

  const goHome = useCallback(() => {
    navigate('Main');
  }, [navigate]);

  const goToStart = useCallback(() => {
    navigate('NewRoomMainInfo');
  }, [navigate]);

  const startRoom = useCallback(() => {
    // navigate('JoiningRoom');
  }, [navigate]);

  const room: RoomOld = useMemo(() => {
    return {
      ...roomUpcoming,
      name: roomData.name,
      description: roomData.description,
      thumbnail: roomData.thumbnail,
      tags: roomData.tags,
      privacy: roomData.privacy,
      started_at: roomData.started_at ?? new Date().toISOString(),
    };
  }, [roomData]);

  const urlToShare = useMemo(() => {
    return `chatter://app/room/yyj5-j14m`;
  }, []);

  return (
    <SafeAreaView style={baseScreenLayout.baseSafeArea}>
      <ScreenHeader
        title={t('room.roomScheduled')}
        description={
          <Typography type='body' style={styles.headerDescription} size='medium' color='textSecondary'>
            {t('room.yourRoomScheduledSuccessfully')}
          </Typography>
        }
        style={commonStyles.baseScreenPadding}
      >
        <IconButton iconName='close-outline' type='secondary' size='xl' onPress={goBack} />
      </ScreenHeader>
      <Flex style={commonStyles.baseScreenPadding} gap={24} flex={1} alignItems='center' justifyContent='center'>
        {/* <RoomPreviewCard style={styles.roomPreviewCard} room={room} isList={true} /> */}
        <Flex flexDirection='row' gap={8}>
          <IconButton type='ghost' size='3xl' iconName='pencil-outline' onPress={goToStart} />
          <IconButton type='ghost' size='3xl' iconName='share-outline' onPress={openSharePopup} />
        </Flex>
      </Flex>
      <Flex style={commonStyles.baseFooter} gap={4} flexDirection='row'>
        <Button
          style={commonStyles.flexFull}
          text={t('common.startNow')}
          type='secondary'
          size='lg'
          onPress={startRoom}
        />
        <Button style={commonStyles.flexFull} text={t('common.done')} type='primary' size='lg' onPress={goHome} />
      </Flex>
      <SharePopup
        open={showShare}
        setOpened={setShowShare}
        title={t('common.shareRoom')}
        message={roomData.name}
        url={urlToShare}
      />
    </SafeAreaView>
  );
};

export default memo(RoomScheduled);

const styles = StyleSheet.create({
  headerDescription: {
    width: '85%',
  },
  roomPreviewCard: {
    width: '100%',
  },
});
