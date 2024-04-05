import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { api } from '~/api';
import { client } from '~/services/websocket';
import { useStorageUser } from '~/services/mmkv/auth';
import { RoomServiceEvents, RoomServiceOnEvents } from '~/services/websocket/types/RoomServiceEvents';

import { ROOM_REQUESTS_QUERY_KEY } from '../queries/useRoomRequests';
import { ROOM_POLL_QUERY_KEY } from '../queries/usePoll';
import { DEFAULT_POLL_TIME, state } from '../state/roomState';
import { useRoomStore } from './useRoomStore';
import Room from '../state/Room';

import { CustomShowParams } from '~/ui/Toast/types';
import { PINNED_LINKS_QUERY_KEY } from '../queries/usePinnedLinks';
import { useSetRecoilState } from 'recoil';
import { chatMessagesState, pinnedContributionMessageState } from '../state/chatState';

export const useRoomServiceEvents = (roomId: string, room: Room) => {
  const { navigate } = useNavigation();
  const setPinnedContributionMessage = useSetRecoilState(pinnedContributionMessageState);

  const queryClient = useQueryClient();
  const { clearSelectedPollAnswerState, clearPollTimeState } = useRoomStore();
  const [storageUser] = useStorageUser();

  const setChatMessages = useSetRecoilState(chatMessagesState);
  const setHandRaised = useSetRecoilState(state.handRaisedState);
  const setActivePollId = useSetRecoilState(state.activePollIdState);
  const setPollTime = useSetRecoilState(state.pollTimeState);

  const handleMessage = useCallback(
    async (response: any) => {
      if (response.topic.includes('/chat')) {
        if (response.content.type === 'contribution') {
          setPinnedContributionMessage(response.content);
        }

        setChatMessages((prevMessages) => [...prevMessages, response.content]);
      }
    },
    [setChatMessages, setPinnedContributionMessage],
  );

  const handleRequest = useCallback<RoomServiceOnEvents[RoomServiceEvents.REQUEST]>(() => {
    queryClient.invalidateQueries({ queryKey: [ROOM_REQUESTS_QUERY_KEY] });
  }, [queryClient]);

  const hadnleRequestHandled = useCallback<RoomServiceOnEvents[RoomServiceEvents.REQUEST_HANDLED]>(
    async (response) => {
      if (storageUser?.id === response.user.id) {
        if (response.approved) {
          await room.moveToStage(response.token);
        }
      }

      setHandRaised(false);
      queryClient.invalidateQueries({ queryKey: [ROOM_REQUESTS_QUERY_KEY] });
    },
    [room, storageUser, queryClient, setHandRaised],
  );

  const handleInviteToSpeak = useCallback<RoomServiceOnEvents[RoomServiceEvents.INVITE_TO_SPEAK]>(
    (response) => {
      if (storageUser?.id === response.payload.user.id) {
        Toast.show({
          type: 'normal',
          text1: `${response.payload.invited_by.first_name} invited you to speak`,
          autoHide: false,
          props: {
            withButtons: true,
            dismissButtonText: 'Not now',
            acceptButtonText: 'Accept',
            onAccept: () => {
              api.room.respondToInviteToSpeak({ invite_id: response.payload.id, accepted: true });
              room.moveToStage(response.payload.token);
            },
            onDismiss: () => {
              api.room.respondToInviteToSpeak({ invite_id: response.payload.id, accepted: false });
            },
          },
        } as CustomShowParams);
      }
    },
    [storageUser, room],
  );

  const handleInviteToSpeakResponse = useCallback<RoomServiceOnEvents[RoomServiceEvents.INVITE_TO_SPEAK_RESPONSE]>(
    (response) => {
      if (storageUser?.id === response.payload.invited_by.id) {
        if (!response.payload.accepted) {
          Toast.show({
            type: 'error',
            text1: `${response.payload.user.first_name} has denied request to speak`,
          } as CustomShowParams);
        }
      }
    },
    [storageUser],
  );

  const handleUserRemoved = useCallback<RoomServiceOnEvents[RoomServiceEvents.USER_REMOVED]>(
    (response) => {
      if (storageUser?.id === response.payload.user.id) {
        Toast.show({
          type: 'error',
          text1: 'You were roomed from room',
        } as CustomShowParams);
        navigate('Main');
      }
    },
    [storageUser, navigate],
  );

  const handleEndRoom: RoomServiceOnEvents[RoomServiceEvents.ROOM_ENDED] = useCallback(() => {
    navigate('Main');
    Toast.show({
      type: 'normal',
      text1: 'Room has ended',
    });
  }, [navigate]);

  const handlePollCreated: RoomServiceOnEvents[RoomServiceEvents.POLL_CREATED] = useCallback(
    (response) => {
      const createdTimeInMilis = new Date(response.payload.created_at);
      setPollTime(createdTimeInMilis.getTime() + DEFAULT_POLL_TIME);
      setActivePollId(response.payload.id);
    },
    [setActivePollId, setPollTime],
  );

  const handlePollVoteCreated: RoomServiceOnEvents[RoomServiceEvents.POLL_VOTE_CREATED] = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [ROOM_POLL_QUERY_KEY] });
  }, [queryClient]);

  const handlePollEnded: RoomServiceOnEvents[RoomServiceEvents.POLL_ENDED] = useCallback(() => {
    setActivePollId(null);
    clearPollTimeState();
    clearSelectedPollAnswerState();
  }, [setActivePollId, clearSelectedPollAnswerState, clearPollTimeState]);

  const handleNewPinnedLink: RoomServiceOnEvents[RoomServiceEvents.NEW_PINNED_LINK] = useCallback(
    (response) => {
      if (response.payload.user.id !== storageUser?.id) {
        Toast.show({
          text1: 'New pinned link',
          type: 'normal',
          text2: response.payload.link.title,
          props: {
            withTopRightButton: 'link',
            onOpenLink: () => {
              console.log('===> OPEN LINK');
            },
          },
        } as CustomShowParams);
      }
      queryClient.invalidateQueries({ queryKey: [PINNED_LINKS_QUERY_KEY] });
    },
    [queryClient, storageUser],
  );

  const handleDeletingPinnedLinks = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [PINNED_LINKS_QUERY_KEY] });
  }, [queryClient]);

  useEffect(() => {
    client.on('message', handleMessage);
    client.on(RoomServiceEvents.REQUEST, handleRequest);
    client.on(RoomServiceEvents.REQUEST_HANDLED, hadnleRequestHandled);
    client.on(RoomServiceEvents.INVITE_TO_SPEAK, handleInviteToSpeak);
    client.on(RoomServiceEvents.INVITE_TO_SPEAK_RESPONSE, handleInviteToSpeakResponse);
    client.on(RoomServiceEvents.USER_REMOVED, handleUserRemoved);
    client.on(RoomServiceEvents.ROOM_ENDED, handleEndRoom);
    client.on(RoomServiceEvents.POLL_CREATED, handlePollCreated);
    client.on(RoomServiceEvents.POLL_VOTE_CREATED, handlePollVoteCreated);
    client.on(RoomServiceEvents.POLL_ENDED, handlePollEnded);
    client.on(RoomServiceEvents.NEW_PINNED_LINK, handleNewPinnedLink);
    client.on(RoomServiceEvents.DELETE_PINNED_LINK, handleDeletingPinnedLinks);
    client.on(RoomServiceEvents.DELETE_ALL_PINNED_LINKS, handleDeletingPinnedLinks);

    return () => {
      client.off('message', handleMessage);
      client.off(RoomServiceEvents.REQUEST, handleRequest);
      client.off(RoomServiceEvents.REQUEST_HANDLED, hadnleRequestHandled);
      client.off(RoomServiceEvents.INVITE_TO_SPEAK, handleInviteToSpeak);
      client.off(RoomServiceEvents.INVITE_TO_SPEAK_RESPONSE, handleInviteToSpeakResponse);
      client.off(RoomServiceEvents.USER_REMOVED, handleUserRemoved);
      client.off(RoomServiceEvents.ROOM_ENDED, handleEndRoom);
      client.off(RoomServiceEvents.POLL_CREATED, handlePollCreated);
      client.off(RoomServiceEvents.POLL_VOTE_CREATED, handlePollVoteCreated);
      client.off(RoomServiceEvents.POLL_ENDED, handlePollEnded);
      client.off(RoomServiceEvents.NEW_PINNED_LINK, handleNewPinnedLink);
      client.off(RoomServiceEvents.DELETE_PINNED_LINK, handleDeletingPinnedLinks);
      client.off(RoomServiceEvents.DELETE_ALL_PINNED_LINKS, handleDeletingPinnedLinks);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
