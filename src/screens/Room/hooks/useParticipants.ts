import { useEffect, useState } from 'react';
import { Participant } from 'livekit-client';

import { RoomServiceEvents } from '~/services/websocket/types/RoomServiceEvents';
import { ListenerParticipant, StageParticipant } from '~/entities/Room';

import Room, { RoomEventOnCallbacks, RoomEvents, RoomOnEvents } from '../state/Room';
import { useLivekitRoom } from './useLivekitRoom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { state } from '../state/roomState';

export function useParticipants(room: Room) {
  const [participantsInited, setPartcipantsInited] = useState(false);

  const {
    participants: livekitParticipants,
    participantsWithVideo: livekitParticipantsWithVideo,
  }: { participants: Participant[]; participantsWithVideo: Participant[] } = useLivekitRoom(room.livekitRoom);
  const [socketParticipants, setSocketParticipants] = useState<StageParticipant[]>([]);
  const [socketParticipantsWithVideo, setSocketParticipantsWithVideo] = useState<StageParticipant[]>([]);

  const [stageParticipants, setStageParticipants] = useState<StageParticipant[] | Participant[]>([]);
  const [stageParticipantsWithVideo, setStageParticipantsWithVideo] = useState<StageParticipant[] | Participant[]>([]);
  const [audienceParticipants, setAudienceParticipants] = useState<ListenerParticipant[]>([]);

  const [currentRoomProvider, setCurrentRoomProvider] = useRecoilState(state.currentRoomProviderState);
  const setCurrentRole = useSetRecoilState(state.currentRoleState);
  const setLivekitStreamingParticipant = useSetRecoilState(state.livekitStreamingParticipantState);
  const setSocketStreamingParticipant = useSetRecoilState(state.socketStreamingParticipantState);

  useEffect(() => {
    const onParticipantsChanged = () => {
      const _stageParticipants = Array.from(room.stageParticipants.values());
      const _audienceParticipants = Array.from(room.audienceParticipants.values());

      const _participants: StageParticipant[] = [];
      const _participantsWithVideo: StageParticipant[] = [];

      _stageParticipants.forEach((p) => {
        if (p.camera_url) {
          _participantsWithVideo.push(p);
        } else {
          _participants.push(p);
        }
      });

      setSocketParticipants([..._participants]);
      setSocketParticipantsWithVideo([..._participantsWithVideo]);

      setAudienceParticipants([..._audienceParticipants]);
    };

    const onConnected: RoomOnEvents[RoomEvents.CONNECTED] = (current_provider) => {
      const _audienceParticipants = Array.from(room.audienceParticipants.values());
      if (current_provider !== 'livekit') {
        const _stageParticipants = Array.from(room.stageParticipants.values());
        const _participants: StageParticipant[] = [];
        const _participantsWithVideo: StageParticipant[] = [];

        _stageParticipants.forEach((p) => {
          if (p.camera_url) {
            _participantsWithVideo.push(p);
          } else {
            _participants.push(p);
          }
        });

        setSocketParticipants([..._participants]);
        setSocketParticipantsWithVideo([..._participantsWithVideo]);
      }
      setLivekitStreamingParticipant(room.livekitStreamingParticipant);
      setSocketStreamingParticipant(room.socketStreamingParticipant);
      setAudienceParticipants([..._audienceParticipants]);
      setPartcipantsInited(true);
    };

    room.once(RoomEvents.CONNECTED, onConnected);
    room.on(RoomServiceEvents.PARTICIPANT_JOINED, onParticipantsChanged);
    room.on(RoomServiceEvents.PARTICIPANT_LEFT, onParticipantsChanged);
    room.on(RoomServiceEvents.LISTENER_JOIN, onParticipantsChanged);
    room.on(RoomServiceEvents.LISTENER_LEAVE, onParticipantsChanged);
    room.on(RoomServiceEvents.SPEAKING_CHANGED, onParticipantsChanged);
    room.on(RoomServiceEvents.MUTE_CHANGED, onParticipantsChanged);
    room.on(RoomServiceEvents.USER_REMOVED, onParticipantsChanged);
    room.on(RoomServiceEvents.VIDEO_START, onParticipantsChanged);
    room.on(RoomServiceEvents.VIDEO_STOP, onParticipantsChanged);

    return () => {
      room.off(RoomEvents.CONNECTED, onConnected);
      room.off(RoomServiceEvents.PARTICIPANT_JOINED, onParticipantsChanged);
      room.off(RoomServiceEvents.PARTICIPANT_LEFT, onParticipantsChanged);
      room.off(RoomServiceEvents.LISTENER_JOIN, onParticipantsChanged);
      room.off(RoomServiceEvents.LISTENER_LEAVE, onParticipantsChanged);
      room.off(RoomServiceEvents.SPEAKING_CHANGED, onParticipantsChanged);
      room.off(RoomServiceEvents.MUTE_CHANGED, onParticipantsChanged);
      room.off(RoomServiceEvents.USER_REMOVED, onParticipantsChanged);
      room.off(RoomServiceEvents.VIDEO_START, onParticipantsChanged);
      room.off(RoomServiceEvents.VIDEO_STOP, onParticipantsChanged);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, currentRoomProvider]);

  useEffect(() => {
    const onMoveToStage: RoomEventOnCallbacks[RoomEvents.MOVED_TO_STAGE] = () => {
      setCurrentRole('speaker');
      setCurrentRoomProvider('livekit');
      setStageParticipants([...livekitParticipants]);
      setStageParticipantsWithVideo([...livekitParticipantsWithVideo]);
      setLivekitStreamingParticipant(room.livekitStreamingParticipant);
      setSocketStreamingParticipant(room.socketStreamingParticipant);
    };

    const onMoveToAudience: RoomEventOnCallbacks[RoomEvents.MOVED_TO_AUDIENCE] = () => {
      setCurrentRole('listener');
      setCurrentRoomProvider('socket');
      setStageParticipants([...socketParticipants]);
      setStageParticipantsWithVideo([...socketParticipantsWithVideo]);
      setLivekitStreamingParticipant(room.livekitStreamingParticipant);
      setSocketStreamingParticipant(room.socketStreamingParticipant);
    };

    room.on(RoomEvents.MOVED_TO_STAGE, onMoveToStage);
    room.on(RoomServiceEvents.MOVED_TO_AUDIENCE, onMoveToAudience);
    return () => {
      room.off(RoomEvents.MOVED_TO_STAGE, onMoveToStage);
      room.off(RoomServiceEvents.MOVED_TO_AUDIENCE, onMoveToAudience);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, livekitParticipants, socketParticipants, livekitParticipantsWithVideo, socketParticipantsWithVideo]);

  useEffect(() => {
    const onScreenShareStart: RoomEventOnCallbacks[RoomServiceEvents.SCREEN_SHARE_START] = () => {
      currentRoomProvider && setLivekitStreamingParticipant(room.livekitStreamingParticipant);
      setSocketStreamingParticipant(room.socketStreamingParticipant);
    };

    const onScreenShareStop: RoomEventOnCallbacks[RoomServiceEvents.SCREEN_SHARE_STOP] = () => {
      currentRoomProvider && setLivekitStreamingParticipant(null);
      setSocketStreamingParticipant(null);
    };

    room.on(RoomServiceEvents.SCREEN_SHARE_START, onScreenShareStart);
    room.on(RoomServiceEvents.SCREEN_SHARE_STOP, onScreenShareStop);

    return () => {
      room.off(RoomServiceEvents.SCREEN_SHARE_START, onScreenShareStart);
      room.off(RoomServiceEvents.SCREEN_SHARE_STOP, onScreenShareStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, currentRoomProvider]);

  useEffect(() => {
    if (participantsInited) {
      if (currentRoomProvider === 'livekit') {
        setStageParticipants([...livekitParticipants]);
        setStageParticipantsWithVideo([...livekitParticipantsWithVideo]);
      } else {
        setStageParticipants([...socketParticipants]);
        setStageParticipantsWithVideo([...socketParticipantsWithVideo]);
      }
    }
  }, [
    participantsInited,
    currentRoomProvider,
    livekitParticipants,
    socketParticipants,
    socketParticipantsWithVideo,
    livekitParticipantsWithVideo,
  ]);

  return {
    stageParticipants,
    stageParticipantsWithVideo,
    stageParticipantsCount: stageParticipants.length + stageParticipantsWithVideo.length,
    audienceParticipants,
  };
}
