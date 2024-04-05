import { type FC, memo, useCallback, Dispatch, SetStateAction } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, SequencedTransition } from 'react-native-reanimated';
import { type LocalParticipant } from 'livekit-client';

import { api } from '~/api';

import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import ReactionButton from './ReactionButton';
import VideoButton from './VideoButton';
import ChatButton from './ChatButton';
import MicButton from './MicButton';

import { normalize } from '~/utils/normalize';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';
import { useNavigation } from '@react-navigation/native';

import { useInitClipMoment } from '../../screens/ClipMoment/useInitClipMoment';
import { CustomShowParams } from '~/ui/Toast/types';
import Toast from 'react-native-toast-message';

type RoomControlsProps = {
  style?: StyleProp<ViewStyle>;
  visible: boolean;
  setVisisble?: SetStateAction<Dispatch<boolean>>;
  localParticipant: LocalParticipant;
};

const RoomControls: FC<RoomControlsProps> = ({ visible, localParticipant }) => {
  const { navigate } = useNavigation();

  const { init: initClipMoment } = useInitClipMoment();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const currentRole = useRecoilValue(state.currentRoleState);
  const [handRaised, setHandRaised] = useRecoilState(state.handRaisedState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const askPermissionForStage = useCallback(async () => {
    if (!roomDetails?.id) {
      return;
    }

    await api.room.makeRoomRequest({
      roomId: roomDetails.id,
      permissions: ['microphone'],
    });

    setHandRaised(true);
  }, [roomDetails, setHandRaised]);

  const goToClipMoment = useCallback(async () => {
    try {
      await initClipMoment();
      navigate('ClipMoment');
      setRoomControlsOpened(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      } as CustomShowParams);
    }
  }, [navigate, setRoomControlsOpened, initClipMoment]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      layout={SequencedTransition.duration(100)}
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={styles.base}
    >
      <Flex style={styles.innerContainer} alignItems='flex-end' justifyContent='center' flexDirection='row' gap={2}>
        <IconButton type='secondary' size='3xl' iconName='cut-outline' onPress={goToClipMoment} />
        <ReactionButton />
        <ChatButton />
        {currentRole !== 'listener' ? (
          <>
            <VideoButton localParticipant={localParticipant} />
            <MicButton localParticipant={localParticipant} />
          </>
        ) : (
          <IconButton
            requested={handRaised}
            disabled={handRaised}
            type='room-control'
            size='3xl'
            iconName='hand-right-outline'
            onPress={askPermissionForStage}
          />
        )}
      </Flex>
    </Animated.View>
  );
};

export default memo(RoomControls);

const styles = StyleSheet.create({
  base: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    pointerEvents: 'box-none',
    bottom: 0,
    zIndex: 4,
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    pointerEvents: 'box-none',
    paddingBottom: normalize(44),
  },
});
