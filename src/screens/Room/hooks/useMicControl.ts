import { useCallback } from 'react';
import { type LocalParticipant, type TrackPublication } from 'livekit-client';
import { useParticipant } from '@livekit/react-native';
import { useRecoilValue } from 'recoil';
import { state } from '../state/roomState';

const isTrackEnabled = (pub?: TrackPublication) => {
  return !(pub?.isMuted ?? true);
};

export const useMicControl = (localParticipant: LocalParticipant) => {
  const { microphonePublication } = useParticipant(localParticipant);
  const micEnabled = isTrackEnabled(microphonePublication);
  const musicMode = useRecoilValue(state.musicModeState);

  const toggleMic = useCallback(() => {
    localParticipant.setMicrophoneEnabled(!micEnabled, {
      echoCancellation: !musicMode,
      autoGainControl: !musicMode,
      noiseSuppression: !musicMode,
      channelCount: 2,
    });
  }, [localParticipant, micEnabled, musicMode]);

  return {
    micEnabled,
    toggleMic,
  };
};
