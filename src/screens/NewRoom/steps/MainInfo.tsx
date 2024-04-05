import { memo, useCallback } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { RoomChannel } from '../components/RoomChannel';
import { RoomName } from '../components/RoomName';
import { RoomPrivacy } from '../components/RoomPrivacy';
import { RoomTopics } from '../components/RoomTopics';

import { baseScreenLayout, commonStyles } from '~/styles';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { roomNameError, roomState } from '../state';
import { useTranslation } from 'react-i18next';

const MainInfo = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();

  const [roomData] = useRecoilState(roomState);
  const [invalidName, setInvalidName] = useRecoilState(roomNameError);
  const resetError = useResetRecoilState(roomNameError);

  const goToDetails = useCallback(() => {
    if (!roomData.name || invalidName.message) {
      setInvalidName({
        triggered: true,
        message: 'Name is required',
      });
      return;
    }
    navigate('NewRoomDetails');
  }, [navigate, invalidName, setInvalidName, roomData]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetError();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <SafeAreaView style={baseScreenLayout.baseSafeArea}>
      <ScreenHeader title={t('common.newRoom')} style={commonStyles.baseScreenPadding}>
        <IconButton iconName='close-outline' type='secondary' size='xl' onPress={goBack} />
      </ScreenHeader>

      <ScrollView
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        style={baseScreenLayout.scrollComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Flex gap={40} style={commonStyles.baseScreenPadding}>
          <RoomName edit />
          <RoomPrivacy edit />
          <RoomTopics edit />
          <RoomChannel edit />
        </Flex>
      </ScrollView>
      <Flex style={commonStyles.baseFooter}>
        <Button type='primary' size='lg' text={t('room.continueToDetails')} onPress={goToDetails} />
      </Flex>
    </SafeAreaView>
  );
};

export default memo(MainInfo);

const styles = StyleSheet.create({
  scrollContainer: {
    ...baseScreenLayout.scrollContent,
    paddingBottom: 300,
  },
});
