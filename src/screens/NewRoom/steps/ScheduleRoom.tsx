import { memo, useCallback } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';

import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import RoomDatePicker from '../components/RoomDatePicker';
import { RoomChannel } from '../components/RoomChannel';
import { RoomPrivacy } from '../components/RoomPrivacy';
import { RoomTopics } from '../components/RoomTopics';
import { RoomName } from '../components/RoomName';

import { baseScreenLayout, commonStyles } from '~/styles';
import { roomState } from '../state';
import { useTranslation } from 'react-i18next';

const ScheduleRoom = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const roomData = useRecoilValue(roomState);

  const goToScheduledRoom = useCallback(() => {
    navigate('NewRoomScheduled');
  }, [navigate]);

  return (
    <SafeAreaView style={baseScreenLayout.baseSafeArea}>
      <ScreenHeader withBackButton title={t('room.scheduleRoom')} style={commonStyles.baseScreenPadding}>
        <IconButton iconName='close-outline' type='secondary' size='xl' onPress={goBack} />
      </ScreenHeader>
      <ScrollView style={baseScreenLayout.scrollComponent} contentContainerStyle={baseScreenLayout.scrollContent}>
        <Flex style={commonStyles.baseScreenPadding} gap={40}>
          <RoomChannel edit={false} />
          <RoomName edit={false} />
          <RoomPrivacy edit={false} />
          {roomData.tags.length > 0 && <RoomTopics edit={false} />}
          <RoomDatePicker />
        </Flex>
      </ScrollView>
      <Flex style={commonStyles.baseFooter}>
        <Button type='primary' size='lg' text={t('room.scheduleRoom')} onPress={goToScheduledRoom} />
      </Flex>
    </SafeAreaView>
  );
};

export default memo(ScheduleRoom);
