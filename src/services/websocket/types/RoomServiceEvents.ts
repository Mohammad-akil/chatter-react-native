import {
  ListenerParticipant,
  PinnedLink,
  Poll,
  PollOptionResult,
  RoomRequest,
  StageParticipant,
} from '~/entities/Room';
import { User, UserMetadata } from '~/entities/User';

export enum RoomServiceEvents {
  REQUEST = 'request',
  REQUEST_HANDLED = 'request_handled',
  INVITE_TO_SPEAK = 'invite_to_speak',
  INVITE_TO_SPEAK_RESPONSE = 'invite_to_speak_response',
  USER_REMOVED = 'user_removed',
  USER_REPERMITTED = 'user_repermitted',
  LISTENER_JOIN = 'listener_join',
  LISTENER_LEAVE = 'listener_leave',
  PARTICIPANT_JOINED = 'participant_joined',
  PARTICIPANT_LEFT = 'participant_left',
  MOVED_TO_AUDIENCE = 'moved_to_audience',
  SPEAKING_CHANGED = 'speaking_changed',
  MUTE_CHANGED = 'mute_changed',
  ROOM_ENDED = 'room_ended',
  VIDEO_START = 'video_start',
  VIDEO_STOP = 'video_stop',
  SCREEN_SHARE_START = 'screen_share_start',
  SCREEN_SHARE_STOP = 'screen_share_stop',
  REACTION = 'reaction',

  //POLL
  POLL_CREATED = 'poll_created',
  POLL_VOTE_CREATED = 'poll_vote_created',
  POLL_ENDED = 'poll_ended',

  //PINNED LINKS
  NEW_PINNED_LINK = 'new_pinned_link',
  DELETE_PINNED_LINK = 'delete_pinned_link',
  DELETE_ALL_PINNED_LINKS = 'delete_all_pinned_links',
}

export type Permissions = 'camera' | 'microphone';

type BaseUser = Pick<
  User,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'username'
  | 'avatar'
  | 'profile_description'
  | 'follower_count'
  | 'verified'
  | 'following_count'
>;

export type RequestEventResponse = {
  service: 'room';
  event: RoomServiceEvents.REQUEST;
  user: BaseUser;
  permissions: Permissions[];
  payload: RoomRequest;
};

export type RequestHandledEventResponse = {
  service: 'room';
  event: RoomServiceEvents.REQUEST_HANDLED;
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>;
  permissions: Permissions[];
} & (
  | {
      approved: true;
      token: string;
    }
  | {
      approved: false;
      token?: null;
    }
);

export type InviteToSpeakEventResponse = {
  service: 'room';
  event: RoomServiceEvents.INVITE_TO_SPEAK;
  payload: {
    id: string;
    created_at: string;
    user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    invited_by: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    token: string;
  };
};

export type InviteToSpeakResponseEventResponse = {
  service: 'room';
  event: RoomServiceEvents.INVITE_TO_SPEAK_RESPONSE;
  payload: {
    id: string;
    created_at: string;
    room_id: string;
    user_id: string;
    invited_by_id: string;
    room: {
      id: string;
    };
    user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    invited_by: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    accepted: boolean;
  };
};

export type UserRemovedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.USER_REMOVED;
  payload: {
    id: string;
    created_at: string;
    user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    removed_by: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
  };
};

export type UserRepermittedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.USER_REPERMITTED;
  payload: {
    id: string;
    created_at: string;
    room: {
      id: string;
    };
    user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
    removed_by: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
  };
};

export type ListenerJoinEventResponse = {
  service: 'room';
  room_id: string;
  event: RoomServiceEvents.LISTENER_JOIN;
  payload: ListenerParticipant;
};

export type ListenerLeaveEventResponse = {
  service: 'room';
  event: RoomServiceEvents.LISTENER_LEAVE;
  room_id: string;
  payload: ListenerParticipant;
};

export type ParticipantJoinedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.PARTICIPANT_JOINED;
  room: string;
  user: StageParticipant;
};

export type ParticipantLeftEventResponse = {
  service: 'room';
  event: RoomServiceEvents.PARTICIPANT_LEFT;
  room: string;
  user: StageParticipant;
};

export type MuteChangedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.MUTE_CHANGED;
  participant_id: string;
  isMuted: boolean;
};

export type SpeakingChangedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.SPEAKING_CHANGED;
  participant_id: string;
  isSpeaking: boolean;
  room: string;
};

export type MovedToAudienceReasponse = {
  service: 'room';
  event: RoomServiceEvents.MOVED_TO_AUDIENCE;
  payload: {
    user_id: string;
  };
};

export type RoomEndedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.ROOM_ENDED;
  room: string;
};

export type PollCreatedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.POLL_CREATED;
  payload: Omit<Poll, 'results' | 'total_votes'>;
};

export type PollVoteCreatedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.POLL_VOTE_CREATED;
  payload: {
    id: string;
    option: number;
    room_poll: Pick<Poll, 'id' | 'options'> & {
      room_id: string;
      user: Pick<User, 'id' | 'username' | 'avatar' | 'first_name' | 'last_name'>;
    };
    results: PollOptionResult[];
    total_votes: number;
  };
};

export type PollEndedEventResponse = {
  service: 'room';
  event: RoomServiceEvents.POLL_ENDED;
  payload: {
    poll_id: string;
  };
};

export type VideoStartEventResponse = {
  service: 'room';
  event: RoomServiceEvents.VIDEO_START;
  participant_id: string;
  hls_url: string;
};

export type VideoStopEventResponse = {
  service: 'room';
  event: RoomServiceEvents.VIDEO_STOP;
  participant_id: string;
  hls_url: string;
};

export type ReactionEventResponse = {
  service: 'room';
  event: RoomServiceEvents.REACTION;
  payload: {
    user_id: string;
    reaction: string; // emoji
  };
};

export type ScreenShareStartEventResponse = {
  service: 'room';
  event: RoomServiceEvents.SCREEN_SHARE_START;
  participant_id: string;
  participant: UserMetadata;
  hls_url: string;
};

export type ScreenShareStopEventResponse = {
  service: 'room';
  event: RoomServiceEvents.SCREEN_SHARE_STOP;
  participant_id: string;
  participant: UserMetadata;
  hls_url: string;
};

export type NewPinnedLinkEventResponse = {
  service: 'room';
  event: RoomServiceEvents.NEW_PINNED_LINK;
  payload: PinnedLink;
};

export type DeletePinnedLinkEventResponse = {
  service: 'room';
  event: RoomServiceEvents.DELETE_PINNED_LINK;
  payload: PinnedLink;
};

export type DeleteAllPinnedLinkEventResponse = {
  service: 'room';
  event: RoomServiceEvents.DELETE_PINNED_LINK;
  payload: {
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'username' | 'avatar'>;
  };
};

export type RoomServiceOnEvents = {
  [RoomServiceEvents.REQUEST]: (response: RequestEventResponse) => void;
  [RoomServiceEvents.REQUEST_HANDLED]: (response: RequestHandledEventResponse) => void;
  [RoomServiceEvents.INVITE_TO_SPEAK]: (response: InviteToSpeakEventResponse) => void;
  [RoomServiceEvents.INVITE_TO_SPEAK_RESPONSE]: (response: InviteToSpeakResponseEventResponse) => void;
  [RoomServiceEvents.USER_REMOVED]: (response: UserRemovedEventResponse) => void;
  [RoomServiceEvents.USER_REPERMITTED]: (response: UserRepermittedEventResponse) => void;
  [RoomServiceEvents.LISTENER_JOIN]: (response: ListenerJoinEventResponse) => void;
  [RoomServiceEvents.LISTENER_LEAVE]: (response: ListenerLeaveEventResponse) => void;
  [RoomServiceEvents.PARTICIPANT_JOINED]: (response: ParticipantJoinedEventResponse) => void;
  [RoomServiceEvents.PARTICIPANT_LEFT]: (response: ParticipantLeftEventResponse) => void;
  [RoomServiceEvents.MOVED_TO_AUDIENCE]: (response: MovedToAudienceReasponse) => void;
  [RoomServiceEvents.SPEAKING_CHANGED]: (response: SpeakingChangedEventResponse) => void;
  [RoomServiceEvents.MUTE_CHANGED]: (response: MuteChangedEventResponse) => void;
  [RoomServiceEvents.ROOM_ENDED]: (response: RoomEndedEventResponse) => void;
  [RoomServiceEvents.POLL_CREATED]: (response: PollCreatedEventResponse) => void;
  [RoomServiceEvents.POLL_VOTE_CREATED]: (response: PollVoteCreatedEventResponse) => void;
  [RoomServiceEvents.POLL_ENDED]: (response: PollEndedEventResponse) => void;
  [RoomServiceEvents.VIDEO_START]: (response: VideoStartEventResponse) => void;
  [RoomServiceEvents.VIDEO_STOP]: (response: VideoStopEventResponse) => void;

  [RoomServiceEvents.SCREEN_SHARE_START]: (response: ScreenShareStartEventResponse) => void;
  [RoomServiceEvents.SCREEN_SHARE_STOP]: (response: ScreenShareStopEventResponse) => void;

  [RoomServiceEvents.REACTION]: (response: ReactionEventResponse) => void;

  [RoomServiceEvents.NEW_PINNED_LINK]: (response: NewPinnedLinkEventResponse) => void;
  [RoomServiceEvents.DELETE_PINNED_LINK]: (response: DeletePinnedLinkEventResponse) => void;
  [RoomServiceEvents.DELETE_ALL_PINNED_LINKS]: (response: DeleteAllPinnedLinkEventResponse) => void;
};
