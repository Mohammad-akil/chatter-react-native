import { useEffect } from 'react';
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { FadeInDown, FadeOut } from 'react-native-reanimated';

import { RootStackParamList } from '~/navigation';

import RoomSettings from '../screens/RoomSettings';
import JoiningRoom from '../screens/JoiningRoom';
import Chat from '../screens/Chat';
import Room from '../screens/Room';

import ParticipantInfoPopup from '../components/ParticipantInfoPopup';
import StageControls from '../components/StageControls';
import RoomControls from '../components/RoomControls';

import Flex, { AnimatedFlex } from '~/ui/Flex';

import { useRoomServiceEvents } from '../hooks/useRoomServiceEvents';
import { useRoomConnect } from '../hooks/useRoomConnect';

import CreatePoll from '../components/Poll/CreatePoll';
import PollView from '../components/Poll/PollView';
import PasteLinkModal from '../components/Pinned/PasteLinkModal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { state } from '../state/roomState';
import ClipMoment from '../screens/ClipMoment';
import LoaderModal from '../components/LoaderModal';
import { clipMomentState } from '../state/clipMomentState';

type RoomStackList = Pick<RootStackParamList, 'Room' | 'RoomChat' | 'JoiningRoom' | 'RoomSettings' | 'ClipMoment'>;
const Stack = createNativeStackNavigator<RoomStackList>();
const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: false,
};

export const RoomNavigator = ({ route }: NativeStackScreenProps<RootStackParamList, 'RoomNavigator'>) => {
  useKeepAwake();
  const { action_type, room_id } = route.params;

  const {
    room,
    stageParticipants,
    stageParticipantsWithVideo,
    stageParticipantsCount,
    audienceParticipants,
    isConnected,
  } = useRoomConnect(room_id);
  useRoomServiceEvents(room_id, room); // HANDLES WEBSOCKET

  const currentRole = useRecoilValue(state.currentRoleState);
  const currentRoomProvider = useRecoilValue(state.currentRoomProviderState);
  const activePollId = useRecoilValue(state.activePollIdState);
  const [roomControlsOpened, setRoomControlsOpened] = useRecoilState(state.roomControlsOpenedState);

  const momentsScreen = useRecoilValue(clipMomentState.screenState);

  useEffect(() => {
    isConnected && setRoomControlsOpened(true);
  }, [isConnected, setRoomControlsOpened]);

  return (
    <Flex flex={1}>
      <Stack.Navigator initialRouteName='JoiningRoom' screenOptions={screenOptions}>
        <Stack.Screen name='JoiningRoom' options={screenOptions}>
          {(props) => <JoiningRoom {...props} action_type={action_type} />}
        </Stack.Screen>
        <Stack.Screen name='Room' options={screenOptions}>
          {(props) => (
            <Room
              {...props}
              room_id={room_id}
              stageParticipants={stageParticipants}
              stageParticipantsWithVideo={stageParticipantsWithVideo}
              currentRoomProvider={currentRoomProvider!}
              stageParticipantsCount={stageParticipantsCount}
              audienceParticipants={audienceParticipants}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name='RoomChat' options={screenOptions} component={Chat} />
        <Stack.Screen name='RoomSettings' options={screenOptions} component={RoomSettings} />
        <Stack.Screen name='ClipMoment' options={screenOptions} component={ClipMoment} />
      </Stack.Navigator>
      <RoomControls visible={roomControlsOpened} localParticipant={room.livekitRoom.localParticipant} />
      {activePollId && (
        <AnimatedFlex entering={FadeInDown.duration(250).delay(1500)} exiting={FadeOut.duration(250)}>
          <PollView poll_id={activePollId} />
        </AnimatedFlex>
      )}

      {momentsScreen.loading && !momentsScreen.dataReady && <LoaderModal />}

      {currentRole === 'host' && <CreatePoll />}
      {currentRole === 'host' && <PasteLinkModal />}
      {currentRole === 'host' && <StageControls />}
      <ParticipantInfoPopup />
    </Flex>
  );
};
