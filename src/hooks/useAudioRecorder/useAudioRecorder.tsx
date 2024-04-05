import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { Platform, Vibration } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { AudioTypes, RecordingStatus } from './types';

const audioRecorderPlayer = new AudioRecorderPlayer();

export interface RecordState {
  recordSecs?: number;
  recordTime?: string;
  playTime?: string;
  currentPositionSec?: number;
  currentDurationSec?: number;
}

const useAudioRecorder = (
  setStatus: Dispatch<SetStateAction<RecordingStatus>>,
  setAudio: Dispatch<SetStateAction<AudioTypes | undefined>>,
) => {
  const [recordState, setRecordState] = useState<RecordState>({
    recordSecs: 0,
    recordTime: '',
    playTime: '',
    currentPositionSec: 0,
    currentDurationSec: 0,
  });

  const onStopRecord = useCallback(async () => {
    setStatus('recorded');
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
  }, [setStatus]);

  const onStartRecord = useCallback(async () => {
    const path = Platform.OS === 'ios' ? 'audio.aac' : RNFS.DocumentDirectoryPath + '/audio.aac';

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    try {
      const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
      const uriUpload = Platform.OS === 'android' ? uri : uri.replace('file://', '');
      setAudio({
        audio: {
          uri: uriUpload,
          name: `audio.aac`,
          type: `audio/aac`,
        },
      });
      audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        if (audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).slice(3, 5) === '60') {
          onStopRecord();
          setStatus('recorded');
          Vibration.vibrate(50);
        }
        setRecordState({
          recordSecs: e.currentPosition,
          recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).slice(3, 5),
        });
      });
    } catch (error) {
      console.warn('Error during recorder initialization:', error);
    }
  }, [onStopRecord, setAudio, setStatus]);

  const onStartPlay = useCallback(
    async (audioPath?: string) => {
      setStatus('playing');
      const path = Platform.OS === 'ios' ? 'audio.aac' : RNFS.DocumentDirectoryPath + '/audio.aac';
      await audioRecorderPlayer.startPlayer(audioPath ? audioPath : path);
      audioRecorderPlayer.setVolume(1.0);
      audioRecorderPlayer.addPlayBackListener(async (e) => {
        setRecordState({
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
          playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).slice(3, 5),
        });
        if (e.currentPosition === e.duration) {
          setStatus('finished');
          audioRecorderPlayer.stopPlayer();
        }
      });
    },
    [setStatus],
  );

  const onPausePlay = useCallback(async () => {
    setStatus('paused');
    await audioRecorderPlayer.pausePlayer();
    audioRecorderPlayer.removePlayBackListener();
  }, [setStatus]);

  const onResumePlay = useCallback(async () => {
    setStatus('playing');
    await audioRecorderPlayer.resumePlayer();

    audioRecorderPlayer.addPlayBackListener(async (e) => {
      setRecordState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)).slice(3, 5),
      });
      if (e.currentPosition === e.duration) {
        setStatus('finished');
        audioRecorderPlayer.stopPlayer();
      }
    });
  }, [setStatus]);

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.09);
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.stopRecorder();
    };
  }, []);

  return {
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onPausePlay,
    onResumePlay,
    recordState,
    setRecordState,
    audioRecorderPlayer,
  };
};

export default useAudioRecorder;
