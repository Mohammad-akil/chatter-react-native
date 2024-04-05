import { Dispatch, SetStateAction } from 'react';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';

export type AudioDescriptionProps = {
  setAudioDescription: Dispatch<SetStateAction<AudioTypes | undefined>>;
  status: RecordingStatus;
  setStatus: Dispatch<SetStateAction<RecordingStatus>>;
};
