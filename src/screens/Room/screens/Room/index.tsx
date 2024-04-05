import { FC, memo, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Participant } from 'livekit-client';

import RoomBeingRecorded from '../../components/RoomBeingRecordedModal';
import AudienceSection from '../../components/Audience/AudienceSection';
import StreamSection from '../../components/Stream/StreamSection';
import PinnedSection from '../../components/Pinned/PinnedSection';
import StageSection from '../../components/Stage/StageSection';
import EndRoomModal from '../../components/EndRoomModal';
import RoomHeader from '../../components/RoomHeader';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';

import { ListenerParticipant, StageParticipant } from '~/entities/Room';

import Audio from 'react-native-video';

import { RoomProvider } from '../../state/Room';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';
import { clipMomentState } from '../../state/clipMomentState';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

type RoomProps = {
  room_id: string;
  currentRoomProvider: RoomProvider;
  stageParticipants: StageParticipant[] | Participant[];
  stageParticipantsWithVideo: StageParticipant[] | Participant[];
  stageParticipantsCount: number;
  audienceParticipants: ListenerParticipant[];
};

const Room: FC<RoomProps> = ({
  room_id,
  stageParticipants,
  stageParticipantsWithVideo,
  stageParticipantsCount,
  audienceParticipants,
}) => {
  const [showPinned, setShowPinned] = useState(true);

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const currentRole = useRecoilValue(state.currentRoleState);
  const endRoomModalOpened = useRecoilValue(state.endRoomModalOpenedState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const clearCreatingMomentState = useResetRecoilState(clipMomentState.creatingMoment);
  const clearMomentTitleState = useResetRecoilState(clipMomentState.momentTitleState);
  const creatingMomentState = useRecoilValue(clipMomentState.creatingMoment);

  const createdMomentTitle = useRecoilValue(clipMomentState.momentTitleState);

  useFocusEffect(
    useCallback(() => {
      if (creatingMomentState === 'SUCCESS') {
        Toast.show({
          text1: 'Moment successfully uploaded',
          type: 'normal',
          text2: `Your moment, "${createdMomentTitle}" has successfully uploaded`,
          onHide: () => {
            clearCreatingMomentState();
            clearMomentTitleState();
            setRoomControlsOpened(true);
          },
          props: {
            withTopRightButton: 'link',
            onOpenLink: () => {
              console.log('===> OPEN LINK');
            },
          },
        } as CustomShowParams);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [creatingMomentState]),
  );

  const { navigate } = useNavigation();
  const handleGoingBack = useCallback(() => {
    navigate('Main');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <SafeAreaView style={styles.baseSafeArea}>
      <RoomHeader
        style={styles.header}
        roomData={roomDetails}
        roomBeingRecorded={false}
        partcipantsCount={stageParticipantsCount + audienceParticipants.length}
        goBack={handleGoingBack}
      />
      <ScrollView
        style={styles.scrollComponent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PinnedSection style={styles.sectionBase} roomId={room_id} show={showPinned} setShow={setShowPinned} />
        <StreamSection />
        {stageParticipantsCount > 0 && (
          <StageSection
            participants={stageParticipants}
            participantsWithVideo={stageParticipantsWithVideo}
            participantsCount={stageParticipantsCount}
          />
        )}
        {audienceParticipants.length > 0 && <AudienceSection listeners={audienceParticipants} />}
      </ScrollView>
      {/* {room.isRecording && <RoomBeingRecorded leaveRoom={handleGoingBack} />} */}
      {endRoomModalOpened && <EndRoomModal />}
      {currentRole === 'listener' && (
        <Audio
          source={{ uri: 'https://chatter.b-cdn.net/app/test/llhls.m3u8' }} // Can be a URL or a local file.
          style={{ display: 'none' }}
          bufferConfig={{
            maxBufferMs: 2000,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(Room);

const styles = StyleSheet.create({
  baseSafeArea: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: colorPalette.grey850,
  },
  header: {
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: normalize(338),
    gap: normalize(32),
  },
  scrollComponent: {
    overflow: 'hidden',
  },
  sectionBase: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(20),
  },
});
