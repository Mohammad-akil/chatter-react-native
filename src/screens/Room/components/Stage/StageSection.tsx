import { type FC, memo, useCallback, useEffect, useRef, useState, LegacyRef } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View, LayoutAnimation, LogBox } from 'react-native';

import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { StageParticipant } from '~/entities/Room';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { LivekitStageParticipantItem, StageParticipantItem } from '../StageParticipant/StageParticipantItem';

import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';

import { UserMetadata } from '~/entities/User';
import { Participant } from 'livekit-client';
import { colorPalette } from '~/styles/colors';
import { useRoomRequests } from '../../queries/useRoomRequests';
import VideoParticipantsView from './VideoParticipantsView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';
LogBox.ignoreLogs(['Looks like']); // Ignore warning

type StageSectionProps = {
  style?: StyleProp<ViewStyle>;
  participants: StageParticipant[] | Participant[];
  participantsWithVideo: StageParticipant[] | Participant[];
  participantsCount: number;
};

const Separator = memo(() => {
  return <View style={styles.separator} />;
});

const StageSection: FC<StageSectionProps> = ({ style, participants, participantsWithVideo, participantsCount }) => {
  const [_participants, _setParticipants] = useState([...participants]);
  const { t } = useTranslation();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const currentRole = useRecoilValue(state.currentRoleState);
  const currentRoomProvider = useRecoilValue(state.currentRoomProviderState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);
  const setParticipantInfoPopup = useSetRecoilState(state.participantInfoPopupState);
  const setStageControlPopupOpened = useSetRecoilState(state.stageControlPopupOpenedState);

  const { data: roomRequests } = useRoomRequests(roomDetails?.id);

  const list = useRef<FlashList<StageParticipant | Participant> | null>(null);

  useEffect(() => {
    _setParticipants([...participants]);
  }, [participants]);

  useEffect(() => {
    list.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: 'easeInEaseOut', property: 'opacity' },
      create: { type: 'easeInEaseOut', property: 'opacity' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
  }, [_participants]);

  const openStageControl = useCallback(() => {
    setStageControlPopupOpened(true);
    setRoomControlsOpened(false);
  }, [setStageControlPopupOpened, setRoomControlsOpened]);

  const openParticipantInfo = useCallback(
    (participant: UserMetadata) => {
      setParticipantInfoPopup({
        open: true,
        participantInfo: participant,
      });
      setRoomControlsOpened(false);
    },
    [setParticipantInfoPopup, setRoomControlsOpened],
  );

  const renderSocketParticipants = useCallback<ListRenderItem<StageParticipant>>(
    ({ item }) => {
      const _openParticipantInfo = () => {
        openParticipantInfo(item.metadata);
      };

      return (
        <TouchableOpacity onPress={_openParticipantInfo}>
          <StageParticipantItem
            user_id={item.metadata.user_id}
            first_name={item.metadata.user_first_name}
            avatar={item.metadata.user_avatar}
            role={item.metadata.role}
            verified={item.metadata.verified}
            isSpeaking={item.isSpeaking}
            isMuted={item.isMuted}
          />
        </TouchableOpacity>
      );
    },
    [openParticipantInfo],
  );

  const renderLivekitParticipants = useCallback<ListRenderItem<Participant>>(
    ({ item }) => {
      const _openParticipantInfo = () => {
        const userData: UserMetadata = JSON.parse(item.metadata!);
        openParticipantInfo(userData);
      };

      return (
        <TouchableOpacity onPress={_openParticipantInfo}>
          <LivekitStageParticipantItem key={item.sid} participant={item as Participant} />
        </TouchableOpacity>
      );
    },
    [openParticipantInfo],
  );

  return (
    <AnimatedFlex gap={16} layout={LinearTransition.duration(200)} entering={FadeIn.duration(200)} style={style}>
      <Flex
        style={commonStyles.baseScreenPadding}
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Flex flexDirection='row' alignItems='center' gap={12}>
          <Typography type='headline' size='small'>
            {t('room.stage')}
          </Typography>
          <Typography type='label' size='medium'>
            {participantsCount}
          </Typography>
        </Flex>
        <Flex flexDirection='row' alignItems='center'>
          {currentRole === 'host' && (
            <TouchableOpacity activeOpacity={0.6} style={stageControlStyles.base} onPress={openStageControl}>
              <Icon size={normalize(24)} color={colorPalette.white} name='arrow-forward-circle-sharp' />
              {roomRequests && roomRequests.length > 0 && (
                <AnimatedFlex
                  entering={FadeIn.duration(100)}
                  exiting={FadeOut.duration(100)}
                  alignItems='center'
                  justifyContent='center'
                  style={stageControlStyles.badge}
                >
                  <Typography type='body' size='small'>
                    {roomRequests.length}
                  </Typography>
                </AnimatedFlex>
              )}
            </TouchableOpacity>
          )}
          {/* <IconButton type='text' size='xl' iconName='expand-outline' /> COMMING SOON */}
        </Flex>
      </Flex>
      <Flex gap={24}>
        {participantsWithVideo.length > 0 && (
          <VideoParticipantsView
            style={commonStyles.baseScreenPadding}
            participants={participantsWithVideo}
            openParticipantInfo={openParticipantInfo}
          />
        )}
        {_participants.length > 0 && (
          <Flex style={styles.participantsListWrapper}>
            {currentRoomProvider === 'livekit' ? (
              <FlashList
                ref={list as LegacyRef<FlashList<Participant>>}
                scrollEnabled={false}
                data={_participants as Participant[]}
                keyExtractor={(item) => item.sid}
                numColumns={3}
                estimatedItemSize={130}
                ItemSeparatorComponent={Separator}
                renderItem={renderLivekitParticipants}
              />
            ) : (
              <FlashList
                ref={list as LegacyRef<FlashList<StageParticipant>>}
                scrollEnabled={false}
                data={_participants as StageParticipant[]}
                keyExtractor={(item) => item.sid}
                numColumns={3}
                estimatedItemSize={130}
                ItemSeparatorComponent={Separator}
                renderItem={renderSocketParticipants}
              />
            )}
          </Flex>
        )}
      </Flex>
    </AnimatedFlex>
  );
};

export default memo(StageSection);

const styles = StyleSheet.create({
  participantsListWrapper: {
    minHeight: normalize(130),
  },
  separator: {
    width: '100%',
    height: normalize(16),
  },
});

const stageControlStyles = StyleSheet.create({
  base: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    backgroundColor: colorPalette.error500,
    borderRadius: 360,
    width: normalize(20),
    height: normalize(20),
    right: 0,
    top: 0,
  },
});
