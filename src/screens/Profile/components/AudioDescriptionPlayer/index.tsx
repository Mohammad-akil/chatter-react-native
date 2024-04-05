import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { RecordingStatus } from '~/hooks/useAudioRecorder/types';
import { useStorageUser } from '~/services/mmkv/auth';
import IconButton from '~/ui/IconButton';

const audioPlayer = new AudioRecorderPlayer();

const AudioDescriptionPlayer = ({
  status,
  setStatus,
}: {
  status: string;
  setStatus: Dispatch<SetStateAction<RecordingStatus>>;
}) => {
  const [user] = useStorageUser();

  const playAudioDescription = useCallback(() => {
    setStatus('playing');
    if (user?.profile_audio_description) {
      audioPlayer.startPlayer(user?.profile_audio_description);
      audioPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          setStatus('recorded');
          audioPlayer.stopPlayer();
        }
      });
    }
  }, [setStatus, user?.profile_audio_description]);

  const pauseAudioDescription = useCallback(() => {
    setStatus('paused');
    if (user?.profile_audio_description) {
      audioPlayer.removePlayBackListener();
      audioPlayer.pausePlayer();
    }
  }, [setStatus, user?.profile_audio_description]);

  const resumeAudioDescription = useCallback(() => {
    setStatus('playing');
    if (user?.profile_audio_description) {
      audioPlayer.removePlayBackListener();
      audioPlayer.resumePlayer();
    }
  }, [setStatus, user?.profile_audio_description]);

  const handlePlayer = useCallback(() => {
    switch (status) {
      case 'paused':
        return resumeAudioDescription();
      case 'playing':
        return pauseAudioDescription();
      case 'recorded':
        return playAudioDescription();
    }
  }, [pauseAudioDescription, playAudioDescription, resumeAudioDescription, status]);
  return (
    <IconButton iconName={status === 'playing' ? 'pause' : 'play'} type='secondary' size='3xl' onPress={handlePlayer} />
  );
};

export default memo(AudioDescriptionPlayer);
