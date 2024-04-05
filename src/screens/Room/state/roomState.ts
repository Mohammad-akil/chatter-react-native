import { atom } from 'recoil';
import { ParticipantRole, Room as RoomType, VideoType } from '~/entities/Room';
import { UserMetadata } from '~/entities/User';
import Room, { RoomProvider } from './Room';
import { LocalTrackPublication, Participant } from 'livekit-client';

export const DEFAULT_POLL_TIME = 300000;

const roomState = atom<Room>({
  key: 'room_state',
  default: new Room(),
  dangerouslyAllowMutability: true,
});

const currentRoleState = atom<ParticipantRole | null>({
  key: 'current_role_state',
  default: null,
});

const musicModeState = atom({
  key: 'music_mode_state',
  default: false,
});

const currentRoomProviderState = atom<RoomProvider | null>({
  key: 'current_room_provider_state',
  default: null,
});

const roomDetailsState = atom<RoomType | null>({
  key: 'room_details_state',
  default: null,
});

const handRaisedState = atom<boolean>({
  key: 'hand_raised_state',
  default: false,
});

const activeSpeakersState = atom<UserMetadata[]>({
  key: 'active_speakers_state',
  default: [],
});

// CONTROLS
const endRoomModalOpenedState = atom<boolean>({
  key: 'end_room_modal_opened_state',
  default: false,
});

const stageControlPopupOpenedState = atom<boolean>({
  key: 'stage_control_popup_opened_state',
  default: false,
});

const participantInfoPopupState = atom<{
  open: boolean;
  participantInfo: UserMetadata | null;
}>({
  key: 'participant_info_popup_state',
  default: {
    open: false,
    participantInfo: null,
  },
});

const roomControlsOpenedState = atom<boolean>({
  key: 'room_controls_opened_state',
  default: false,
});

const createPollPopupOpenedState = atom({
  key: 'create_poll_popup_opened_state',
  default: false,
});

export type PollState = {
  question: string | null;
  options: Map<number, { option: number; text: string | null; placeholder: string }>;
};

const cretePollState = atom<PollState>({
  key: 'create_poll_state',
  default: {
    question: null,
    options: new Map([
      [1, { option: 1, text: null, placeholder: 'Option 1' }],
      [2, { option: 2, text: null, placeholder: 'Option 2' }],
    ]),
  },
});

const activePollIdState = atom<string | null>({
  key: 'active_poll_id_state',
  default: null,
});

const selectedPollAnswerState = atom<number | null>({
  key: 'selected_poll_answer_state',
  default: null,
});

const pollTimeState = atom<null | number>({
  key: 'poll_time_state',
  default: null,
});

const createLinkPopupOpenedState = atom({
  key: 'create_link_popup_opened_state',
  default: false,
});

const selectedVideoTypeState = atom<VideoType | null>({
  key: 'selected_video_type_state',
  default: null,
});

const localTrackPublicationState = atom<LocalTrackPublication | null>({
  key: 'local_track_publication_state',
  default: null,
  dangerouslyAllowMutability: true,
});

const livekitStreamingParticipantState = atom<Participant | null>({
  key: 'livekit_streaming_participant_state',
  default: null,
  dangerouslyAllowMutability: true,
});

const socketStreamingParticipantState = atom<(UserMetadata & { hls_url: string }) | null>({
  key: 'socket_streaming_participant_state',
  default: null,
});

export const state = {
  roomState,
  roomDetailsState,
  activeSpeakersState,
  handRaisedState,
  currentRoleState,
  currentRoomProviderState,
  musicModeState,
  selectedVideoTypeState,
  localTrackPublicationState,
  livekitStreamingParticipantState,
  socketStreamingParticipantState,
  //UI
  roomControlsOpenedState,
  stageControlPopupOpenedState,
  participantInfoPopupState,
  endRoomModalOpenedState,

  //POLL
  cretePollState,
  createPollPopupOpenedState,
  activePollIdState,
  selectedPollAnswerState,
  pollTimeState,

  // PINNNED LINKS
  createLinkPopupOpenedState,
};
