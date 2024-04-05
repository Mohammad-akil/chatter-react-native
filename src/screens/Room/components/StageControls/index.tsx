import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import BottomSheet from '~/ui/BottomSheet';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import StageRequestsList from './StageRequestsList';
import RemovedUsersList from './RemovedUsersList';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

import { useRoomRequests } from '../../queries/useRoomRequests';
import { useRemovedUsers } from '../../queries/useRemovedUsers';
import { ScrollView } from 'react-native-gesture-handler';
import { usePinnedLinks } from '../../queries/usePinnedLinks';
import PinnedLinksList from './PinnedLinksList';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type StageControlsProps = {
  style?: StyleProp<ViewStyle>;
};

const snapPoints = ['75%', '90%'];

const StageControls: FC<StageControlsProps> = () => {
  const { t } = useTranslation();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const activePollId = useRecoilValue(state.activePollIdState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);
  const setCreatePinnedLinkOpened = useSetRecoilState(state.createLinkPopupOpenedState);
  const [stageControlPopupOpened, setStageControlPopupOpened] = useRecoilState(state.stageControlPopupOpenedState);
  const [createPollPopupOpened, setCreatePollPopupOpened] = useRecoilState(state.createPollPopupOpenedState);

  const { data: roomRequests } = useRoomRequests(roomDetails?.id);
  const { data: removedUsers } = useRemovedUsers(roomDetails?.id);
  const { data: pinnedLinks } = usePinnedLinks(roomDetails?.id);

  const showRoomControls = useCallback(() => {
    !createPollPopupOpened && setRoomControlsOpened(true);
  }, [setRoomControlsOpened, createPollPopupOpened]);

  const closePopup = useCallback(() => {
    setStageControlPopupOpened(false);
  }, [setStageControlPopupOpened]);

  const openCreatingPollPopup = useCallback(() => {
    setCreatePollPopupOpened(true);
    setStageControlPopupOpened(false);
    setRoomControlsOpened(false);
  }, [setCreatePollPopupOpened, setStageControlPopupOpened, setRoomControlsOpened]);

  const openCreatePinnedLinkPopup = useCallback(() => {
    setCreatePinnedLinkOpened(true);
    setStageControlPopupOpened(false);
    setRoomControlsOpened(false);
  }, [setCreatePinnedLinkOpened, setStageControlPopupOpened, setRoomControlsOpened]);

  return (
    <BottomSheet
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      style={styles.stageControlsPopup}
      open={stageControlPopupOpened}
      backgroundStyle={styles.background}
      setOpened={setStageControlPopupOpened}
      onDismiss={showRoomControls}
    >
      <Flex style={styles.content} gap={16}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography type='headline' size='small'>
            {t('room.stage')}
          </Typography>
          <IconButton type='text' iconName='close-outline' onPress={closePopup} />
        </Flex>
        <Flex gap={12}>
          <Typography type='label' size='large'>
            {t('room.quickActions')}
          </Typography>
          <Flex gap={12} flexDirection='row'>
            <Flex alignItems='center' gap={8}>
              <IconButton size='3xl' iconName='link-outline' onPress={openCreatePinnedLinkPopup} />
              <Typography type='body' size='semibold'>
                {t('room.pinLink')}
              </Typography>
            </Flex>
            <Flex alignItems='center' gap={8}>
              <IconButton disabled={!!activePollId} size='3xl' iconName='podium' onPress={openCreatingPollPopup} />
              <Typography type='body' size='semibold'>
                {t('room.newPoll')}
              </Typography>
            </Flex>
          </Flex>
        </Flex>
        <ScrollView
          contentInset={{ bottom: 1000 }}
          style={{ height: '100%' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: normalize(16) }}
        >
          {pinnedLinks && pinnedLinks.length > 0 && <PinnedLinksList pinnedLinks={pinnedLinks} />}
          {roomRequests && roomRequests.length > 0 && (
            <Flex gap={8}>
              <View style={styles.divider}></View>
              <StageRequestsList roomRequests={roomRequests} />
            </Flex>
          )}
          {removedUsers && removedUsers.length > 0 && (
            <Flex gap={8}>
              <View style={styles.divider}></View>
              <RemovedUsersList removedUsers={removedUsers} />
            </Flex>
          )}
        </ScrollView>
      </Flex>
    </BottomSheet>
  );
};

export default memo(StageControls);

const styles = StyleSheet.create({
  stageControlsPopup: {
    marginHorizontal: normalize(16),
  },

  background: {
    backgroundColor: colors.surface.surfaceComponent,
  },

  content: {
    padding: normalize(16),
  },

  divider: {
    width: '100%',
    height: 0.6,
    backgroundColor: colors.border.borderPrimary,
  },
});
