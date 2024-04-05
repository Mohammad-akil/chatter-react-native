import { memo, useCallback } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { baseScreenLayout, commonStyles } from '~/styles';

import { RoomThumbnail } from '../components/RoomThumbnail';
import { RoomDescription } from '../components/RoomDescription';
import { useRecoilState } from 'recoil';
import { roomState } from '~/screens/NewRoom/state';
import { api } from '~/api';
import Toast from 'react-native-toast-message';

const RoomDetails = () => {
  const [roomData] = useRecoilState(roomState);
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();

  const startRoom = useCallback(async () => {
    const payload = {
      title: roomData.name,
      description: roomData.description,
    };

    const response = await api.room.createRoom(payload);

    if (!response.success) {
      Toast.show({
        type: 'error',
        text1: response.error,
      });
      return;
    }

    navigate('RoomNavigator', { room_id: response.data.room.id, action_type: 'start' });
  }, [roomData, navigate]);

  const goToScheduleRoom = useCallback(() => {
    navigate('NewRoomSchedule');
  }, [navigate]);

  return (
    <SafeAreaView style={baseScreenLayout.baseSafeArea}>
      <ScreenHeader withBackButton title={t('common.roomDetails')} style={commonStyles.baseScreenPadding}>
        <IconButton iconName='close-outline' type='secondary' size='xl' onPress={goBack} />
      </ScreenHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={baseScreenLayout.scrollComponent}
        contentContainerStyle={styles.scrollContainer}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        <Flex gap={40} style={commonStyles.baseScreenPadding}>
          <RoomThumbnail />
          <RoomDescription />
        </Flex>
      </ScrollView>
      <Flex flexDirection='row' gap={4} style={commonStyles.baseFooter}>
        <Button
          style={commonStyles.flexFull}
          type='primary'
          size='lg'
          text={t('common.startRoom')}
          onPress={startRoom}
        />
        <IconButton
          iconName='calendar-outline'
          type='ghost'
          borderRadius='minimal'
          size='lg'
          onPress={goToScheduleRoom}
        />
      </Flex>
    </SafeAreaView>
  );
};

export default memo(RoomDetails);

const styles = StyleSheet.create({
  scrollContainer: {
    ...baseScreenLayout.scrollContent,
    paddingBottom: 300,
  },
});
