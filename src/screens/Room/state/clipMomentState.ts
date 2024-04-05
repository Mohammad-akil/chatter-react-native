import { atom } from 'recoil';
import { EventSnapshot, MomentSpeakingUser } from '~/entities/Moments';

type MomentsOpeningState = {
  loading: boolean;
  dataReady: boolean;
  opened: boolean;
};

const screenState = atom<MomentsOpeningState>({
  key: 'screen_state',
  default: {
    loading: false,
    dataReady: false,
    opened: false,
  },
});

const eventSnapshotsState = atom<EventSnapshot[]>({
  key: 'event_snapshot_state',
  default: [],
});

const currentEventSnapshotState = atom<EventSnapshot | null>({
  key: 'current_event_snapshot_state',
  default: null,
});

const speakersState = atom<MomentSpeakingUser[]>({
  key: 'speakers_state',
  default: [],
});

const audioDurationState = atom<number>({
  key: 'audio_duration_state',
  default: 0,
});

const programStartTimeState = atom<number>({
  key: 'program_start_time_state',
  default: 0,
});
const programEndTimeState = atom<number>({
  key: 'program_end_time_state',
  default: 0,
});

const momentTitleState = atom<string>({
  key: 'moment_title_state',
  default: '',
});

const createMomentModalOpenedState = atom({
  key: 'create_moment_modal_opened_state',
  default: false,
});

export type CreateMomentState = 'UPLOADING' | 'SUCCESS' | 'ERROR';

const creatingMoment = atom<CreateMomentState | null>({
  key: 'creating_moment',
  default: null,
});

export const clipMomentState = {
  screenState,
  eventSnapshotsState,
  speakersState,
  currentEventSnapshotState,
  audioDurationState,
  programStartTimeState,
  programEndTimeState,
  momentTitleState,
  createMomentModalOpenedState,
  creatingMoment,
};
