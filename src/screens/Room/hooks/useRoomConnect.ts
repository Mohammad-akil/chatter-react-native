import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { api } from '~/api';
import { CustomShowParams } from '~/ui/Toast/types';

import { ROOM_REMOVED_USERS_QUERY_KEY } from '../queries/useRemovedUsers';
import { ROOM_REQUESTS_QUERY_KEY } from '../queries/useRoomRequests';
import { ROOM_POLL_QUERY_KEY } from '../queries/usePoll';
import { useParticipants } from './useParticipants';

import { RoomEventOnCallbacks, RoomEvents } from '../state/Room';
import { DEFAULT_POLL_TIME, state } from '../state/roomState';

import { AppleAudioConfiguration, AudioTrackState, useIOSAudioManagement } from '@livekit/react-native';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatMessagesState, pinnedContributionMessageState } from '../state/chatState';
import { ContributionMessage, RoomChatMessage } from '~/entities/Message';
import { useRoomStore } from './useRoomStore';

const appAudioSettings: AppleAudioConfiguration = {
  audioCategory: 'playAndRecord',
  audioCategoryOptions: ['mixWithOthers'],
  audioMode: 'videoRecording',
};
function checkAppleAudio(trackState: AudioTrackState, preferSpeakerOutput: boolean) {
  console.log('Checking Apple Audio', { trackState, preferSpeakerOutput });
  return appAudioSettings;
}

async function getInitialData(room_id: string) {
  const joinRoomPromise = api.room.joinRoom(room_id);
  const getRoomDetailsPromise = api.room.getRoomDetails(room_id);
  const getRoomChatHistoryPromise = api.chat.getRoomChatHistory(room_id);

  try {
    const responses = await Promise.all([joinRoomPromise, getRoomDetailsPromise, getRoomChatHistoryPromise]);
    return {
      joinRoomData: responses[0],
      roomDetailsData: responses[1],
      roomChatHistory: responses[2],
    };
  } catch (e) {
    const error = e as Error;
    throw new Error(error.message);
  }
}

function findLastPinnedMessage(messages: RoomChatMessage[]) {
  const messages_copy = [...messages];
  const lastContributionMessage = messages_copy.reverse().find((item) => item.type === 'contribution');
  return (lastContributionMessage as ContributionMessage) || null;
}

export function useRoomConnect(room_id: string) {
  const { navigate, goBack } = useNavigation();

  const setPinnedContributionMessage = useSetRecoilState(pinnedContributionMessageState);

  const queryClient = useQueryClient();
  const { clearStore } = useRoomStore();

  const room = useRecoilValue(state.roomState);
  const setRoomDetails = useSetRecoilState(state.roomDetailsState);
  const setChatMessages = useSetRecoilState(chatMessagesState);
  const setCurrentRole = useSetRecoilState(state.currentRoleState);
  const setCurrentRoomProvider = useSetRecoilState(state.currentRoomProviderState);
  const setActivePollId = useSetRecoilState(state.activePollIdState);
  const setSelectedPollAnswer = useSetRecoilState(state.selectedPollAnswerState);
  const setPollTime = useSetRecoilState(state.pollTimeState);

  const { stageParticipants, stageParticipantsWithVideo, stageParticipantsCount, audienceParticipants } =
    useParticipants(room);
  useIOSAudioManagement(room.livekitRoom, undefined, checkAppleAudio);

  const [isConnected, setIsConnected] = useState(false);

  const disconnect = useCallback(() => {
    room.disconnect();
    // CLEAR QUERY CACHE
    queryClient.removeQueries({
      queryKey: [ROOM_REQUESTS_QUERY_KEY, ROOM_REMOVED_USERS_QUERY_KEY, ROOM_POLL_QUERY_KEY],
    });
    clearStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, room_id, queryClient]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        try {
          const { joinRoomData, roomDetailsData, roomChatHistory } = await getInitialData(room_id);
          await room.connect(room_id, joinRoomData);
          setRoomDetails(roomDetailsData);
          roomDetailsData.active_poll?.user.voted.voted &&
            setSelectedPollAnswer(roomDetailsData.active_poll.user.voted.option);
          setActivePollId(roomDetailsData.active_poll?.id || null);
          roomDetailsData.active_poll?.created_at &&
            setPollTime(new Date(roomDetailsData.active_poll.created_at).getTime() + DEFAULT_POLL_TIME || null);
          setChatMessages(roomChatHistory);
          const pinnedContributionMessage = findLastPinnedMessage(roomChatHistory);
          setPinnedContributionMessage(pinnedContributionMessage);
        } catch (e) {
          const error = e as Error;
          Toast.show({
            type: 'error',
            text1: error.message,
            autoHide: true,
          } as CustomShowParams);
          goBack();
        }
      };
      init();
      return () => {
        disconnect();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room_id]),
  );

  useEffect(() => {
    const onConnected: RoomEventOnCallbacks[RoomEvents.CONNECTED] = (current_provider) => {
      if (room.role) setCurrentRole(room.role);
      setCurrentRoomProvider(current_provider);
      setIsConnected(true);
      navigate('Room');
    };

    room.once(RoomEvents.CONNECTED, onConnected);
  }, [room, navigate, setCurrentRole, setCurrentRoomProvider]);

  return {
    room,
    isConnected,
    stageParticipants,
    audienceParticipants,
    stageParticipantsWithVideo,
    stageParticipantsCount,
    disconnect,
  };
}
