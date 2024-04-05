import { EventEmitter } from 'events';
import type TypedEmitter from 'typed-emitter';
import Toast from 'react-native-toast-message';
import { Room as LiveKitRoom, Participant, RemoteParticipant, Track } from 'livekit-client';
import { AndroidAudioTypePresets, AudioSession } from '@livekit/react-native';

import { api } from '~/api';
import { JoinRoomData } from '~/api/services/room/types';
import { ListenerParticipant, ParticipantRole, StageParticipant } from '~/entities/Room';
import { User, UserMetadata } from '~/entities/User';

import { storage } from '~/services/mmkv';
import { client } from '~/services/websocket';
import { RoomServiceOnEvents, RoomServiceEvents } from '~/services/websocket/types/RoomServiceEvents';

import { CustomShowParams } from '~/ui/Toast/types';

import { Platform } from 'react-native';

export enum RoomEvents {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  MOVED_TO_STAGE = 'moved_to_stage',
  MOVED_TO_AUDIENCE = 'moved_to_audience',
}

export type RoomOnEvents = {
  [RoomEvents.CONNECTED]: (current_provider: RoomProvider) => void;
  [RoomEvents.DISCONNECTED]: () => void;
  [RoomEvents.MOVED_TO_STAGE]: (current_provider: RoomProvider) => void;
};

export type RoomProvider = 'socket' | 'livekit';

export type RoomEventOnCallbacks = RoomServiceOnEvents & RoomOnEvents;

class Room extends (EventEmitter as new () => TypedEmitter<RoomEventOnCallbacks>) {
  currentUser: User | null;
  room_id?: string;
  media_node?: string;
  hls_playlist_url?: string;
  role?: ParticipantRole;

  stageParticipants: Map<string, StageParticipant>; // user id, stage participant info
  audienceParticipants: Map<string, ListenerParticipant>;

  livekitStreamingParticipant: RemoteParticipant | Participant | null;
  socketStreamingParticipant: (UserMetadata & { hls_url: string }) | null;

  livekitRoom: LiveKitRoom;
  currentRoomProvider: RoomProvider | null;

  constructor() {
    super();
    this.setMaxListeners(100);
    this.currentUser = storage.auth.getUser();

    this.stageParticipants = new Map();
    this.audienceParticipants = new Map();
    this.livekitStreamingParticipant = null;
    this.socketStreamingParticipant = null;

    this.currentRoomProvider = null;
    this.livekitRoom = new LiveKitRoom({
      adaptiveStream: false,
      publishDefaults: {
        audioPreset: {
          maxBitrate: 320_000,
        },
        screenShareEncoding: {
          maxBitrate: 3_000_000,
          maxFramerate: 60,
        },
        forceStereo: true,
        red: false,
        videoCodec: 'h264',
        dtx: false,
        videoEncoding: {
          maxBitrate: 5_000_000,
          maxFramerate: 30,
        },
      },
      audioCaptureDefaults: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        channelCount: 2,
      },
      videoCaptureDefaults: {
        resolution: {
          width: 1280,
          height: 720,
          frameRate: 30,
        },
      },
    });
  }

  private stageParticipantsArrayToMap(participants: StageParticipant[]) {
    participants.forEach((participant) => {
      const dataToSet: StageParticipant = {
        ...participant,
        isMuted: participant.tracks[0]?.muted || true,
      };

      if (participant.screen_share_url) {
        this.socketStreamingParticipant = { ...participant.metadata, hls_url: participant.screen_share_url };
      }

      this.stageParticipants.set(participant.metadata.user_id, dataToSet);
    });
  }

  private audienceParticipantsArrayToMap(listeners: ListenerParticipant[]) {
    listeners.forEach((listener) => {
      this.audienceParticipants.set(listener.user.id, listener);
    });
  }

  private handleListenerJoin: RoomEventOnCallbacks[RoomServiceEvents.LISTENER_JOIN] = async (response) => {
    this.audienceParticipants.set(response.payload.user.id, response.payload);
    this.emit(RoomServiceEvents.LISTENER_JOIN, response);
  };

  private handleListenerLeave: RoomEventOnCallbacks[RoomServiceEvents.LISTENER_LEAVE] = (response) => {
    this.audienceParticipants.delete(response.payload.user.id);
    this.emit(RoomServiceEvents.LISTENER_LEAVE, response);
  };

  private handleParticipantJoined: RoomEventOnCallbacks[RoomServiceEvents.PARTICIPANT_JOINED] = (response) => {
    this.stageParticipants.set(response.user.metadata.user_id, { ...response.user, isMuted: true });
    this.emit(RoomServiceEvents.PARTICIPANT_JOINED, response);
  };

  private handleParticipantLeft: RoomEventOnCallbacks[RoomServiceEvents.PARTICIPANT_LEFT] = (response) => {
    this.stageParticipants.delete(response.user.metadata.user_id);
    this.emit(RoomServiceEvents.PARTICIPANT_LEFT, response);
  };

  private handleSpeakingChanged: RoomEventOnCallbacks[RoomServiceEvents.SPEAKING_CHANGED] = (response) => {
    const participant = this.stageParticipants.get(response.participant_id);

    if (participant) {
      this.stageParticipants.set(response.participant_id, {
        ...participant,
        isSpeaking: response.isSpeaking,
      });
      this.emit(RoomServiceEvents.SPEAKING_CHANGED, response);
    }
  };

  private handleMuteChanged: RoomEventOnCallbacks[RoomServiceEvents.MUTE_CHANGED] = (response) => {
    const participant = this.stageParticipants.get(response.participant_id);
    if (participant) {
      this.stageParticipants.set(response.participant_id, {
        ...participant,
        isMuted: response.isMuted,
      });
      this.emit(RoomServiceEvents.MUTE_CHANGED, response);
    }
  };

  private hadleMoveToAudience: RoomEventOnCallbacks[RoomServiceEvents.MOVED_TO_AUDIENCE] = async (response) => {
    if (response.payload.user_id === this.currentUser?.id) {
      await this.diconnectFromLivekit();
      this.subscribeToListenerEvents();
      this.role = 'listener';
      this.currentRoomProvider = 'socket';
      this.livekitStreamingParticipant = null;

      this.emit(RoomServiceEvents.MOVED_TO_AUDIENCE, response);
    }
  };

  private handleVideoStart: RoomEventOnCallbacks[RoomServiceEvents.VIDEO_START] = async (response) => {
    const participant = this.stageParticipants.get(response.participant_id);

    if (participant) {
      this.stageParticipants.set(response.participant_id, {
        ...participant,
        camera_url: response.hls_url,
      });

      this.emit(RoomServiceEvents.VIDEO_START, response);
    }
  };

  private handleVideoStop: RoomEventOnCallbacks[RoomServiceEvents.VIDEO_STOP] = async (response) => {
    const participant = this.stageParticipants.get(response.participant_id);

    if (participant) {
      this.stageParticipants.set(response.participant_id, {
        ...participant,
        camera_url: null,
      });

      this.emit(RoomServiceEvents.VIDEO_STOP, response);
    }
  };

  private handleScreenShareStart: RoomEventOnCallbacks[RoomServiceEvents.SCREEN_SHARE_START] = async (response) => {
    const livekitParticipant = this.livekitRoom.remoteParticipants.get(response.participant_id);
    if (livekitParticipant) {
      this.livekitStreamingParticipant = livekitParticipant;
    }
    this.socketStreamingParticipant = { ...response.participant, hls_url: response.hls_url };
    this.emit(RoomServiceEvents.SCREEN_SHARE_START, response);
  };
  private handleScreenShareStop: RoomEventOnCallbacks[RoomServiceEvents.SCREEN_SHARE_STOP] = async (response) => {
    this.livekitStreamingParticipant = null;
    this.socketStreamingParticipant = null;
    this.emit(RoomServiceEvents.SCREEN_SHARE_STOP, response);
  };

  private handleNewPinnedLink: RoomEventOnCallbacks[RoomServiceEvents.NEW_PINNED_LINK] = async (response: any) => {
    this.emit(RoomServiceEvents.NEW_PINNED_LINK, response);
  };

  private subscribeToListenerEvents = () => {
    client.subscribe(`room/${this.room_id}/listener`);
  };

  private unsubscribeFromListenerEvents = () => {
    client.unsubscribe(`room/${this.room_id}/listener`);
  };

  private subscribeToEvents = () => {
    if (this.room_id && this.role) {
      client.subscribe(`room/${this.room_id}`);
      client.subscribe(`room/${this.room_id}/events`);
      client.subscribe(`room/${this.room_id}/chat`);
      this.listenEvents();
    }
  };

  private listenEvents() {
    client.on(RoomServiceEvents.LISTENER_JOIN, this.handleListenerJoin);
    client.on(RoomServiceEvents.LISTENER_LEAVE, this.handleListenerLeave);
    client.on(RoomServiceEvents.PARTICIPANT_JOINED, this.handleParticipantJoined);
    client.on(RoomServiceEvents.PARTICIPANT_LEFT, this.handleParticipantLeft);
    client.on(RoomServiceEvents.MOVED_TO_AUDIENCE, this.hadleMoveToAudience);
    client.on(RoomServiceEvents.SPEAKING_CHANGED, this.handleSpeakingChanged);
    client.on(RoomServiceEvents.VIDEO_START, this.handleVideoStart);
    client.on(RoomServiceEvents.VIDEO_STOP, this.handleVideoStop);
    client.on(RoomServiceEvents.MUTE_CHANGED, this.handleMuteChanged);
    client.on(RoomServiceEvents.SCREEN_SHARE_START, this.handleScreenShareStart);
    client.on(RoomServiceEvents.SCREEN_SHARE_STOP, this.handleScreenShareStop);
    client.on(RoomServiceEvents.NEW_PINNED_LINK, this.handleNewPinnedLink);
  }

  private getInititalParticipants = async () => {
    const stageParticipantsDataPromise = api.room.getStageParticipants(this.room_id!);
    const getRoomListenersPromise = api.room.getRoomListeners(this.room_id!);
    try {
      const responses = await Promise.all([stageParticipantsDataPromise, getRoomListenersPromise]);
      this.stageParticipantsArrayToMap(responses[0]);
      this.audienceParticipantsArrayToMap(responses[1]);
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  };

  private checkLivekitScreenSharePublication = async () => {
    const remoteLivekitParticipants = Array.from(this.livekitRoom.remoteParticipants.values());
    const participantWithScreenshare = remoteLivekitParticipants.find((participant) =>
      Boolean(participant.getTrackPublication(Track.Source.ScreenShare)),
    );

    this.livekitStreamingParticipant = participantWithScreenshare ?? null;
  };

  moveToStage = async (token: string) => {
    this.unsubscribeFromListenerEvents();
    await this.connectToLivekit(this.media_node!, token);
    this.role = 'speaker';
    this.currentRoomProvider = 'livekit';
    this.checkLivekitScreenSharePublication();

    this.emit(RoomEvents.MOVED_TO_STAGE, this.currentRoomProvider);
  };

  connectToLivekit = async (media_node: string, token: string) => {
    await AudioSession.startAudioSession();
    if (Platform.OS == 'ios') {
      // await AudioSession.selectAudioOutput('force_speaker');
    }
    if (Platform.OS == 'android') {
      await AudioSession.configureAudio({
        android: {
          audioTypeOptions: AndroidAudioTypePresets.communication,
        },
      });
    }
    await this.livekitRoom.connect(media_node, token, {});
    this.checkLivekitScreenSharePublication();
  };

  diconnectFromLivekit = async () => {
    await AudioSession.stopAudioSession();
    await this.livekitRoom.disconnect();
  };

  connect = async (room_id: string, joinData: JoinRoomData) => {
    this.room_id = room_id;
    this.role = joinData.role;
    this.media_node = joinData.media_node;
    this.hls_playlist_url = joinData.hls_playlist_url;

    this.subscribeToEvents();

    if (this.role !== 'listener') {
      console.log('[class Room: connect]: connecting to livekit');
      await this.connectToLivekit(joinData.media_node, joinData.token);
      this.currentRoomProvider = 'livekit';
    } else {
      this.currentRoomProvider = 'socket';
      this.subscribeToListenerEvents();
    }
    setTimeout(async () => {
      await this.getInititalParticipants();
      const currentRoomProvider = this.role !== 'listener' ? 'livekit' : 'socket';
      this.emit(RoomEvents.CONNECTED, currentRoomProvider);
    }, 200);
  };

  disconnect = async () => {
    this.diconnectFromLivekit();

    client.unsubscribe(`room/${this.room_id}`);
    client.unsubscribe(`room/${this.room_id}/events`);
    client.unsubscribe(`room/${this.room_id}/chat`);

    if (this.role === 'listener') this.unsubscribeFromListenerEvents();

    client.off(RoomServiceEvents.LISTENER_JOIN, this.handleListenerJoin);
    client.off(RoomServiceEvents.LISTENER_LEAVE, this.handleListenerLeave);
    client.off(RoomServiceEvents.PARTICIPANT_JOINED, this.handleParticipantJoined);
    client.off(RoomServiceEvents.PARTICIPANT_LEFT, this.handleParticipantLeft);
    client.off(RoomServiceEvents.MOVED_TO_AUDIENCE, this.hadleMoveToAudience);
    client.off(RoomServiceEvents.SPEAKING_CHANGED, this.handleSpeakingChanged);
    client.off(RoomServiceEvents.MUTE_CHANGED, this.handleMuteChanged);

    client.off(RoomServiceEvents.SCREEN_SHARE_START, this.handleScreenShareStart);
    client.off(RoomServiceEvents.SCREEN_SHARE_STOP, this.handleScreenShareStop);

    this.stageParticipants.clear();
    this.audienceParticipants.clear();
  };
}
export default Room;
