import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';

import { api } from '~/api';
import { clipMomentState } from '../../state/clipMomentState';
import { getMomentSpeakers } from './getMomentSpeakers';
import { state } from '../../state/roomState';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

export const useClipMoment = () => {
  const title = useRecoilValue(clipMomentState.momentTitleState);
  const eventSnapshots = useRecoilValue(clipMomentState.eventSnapshotsState);
  const setCurrentEventSnapshot = useSetRecoilState(clipMomentState.currentEventSnapshotState);
  const [speakers, setSpeakers] = useRecoilState(clipMomentState.speakersState);
  const [audioDuration, setAudioDuration] = useRecoilState(clipMomentState.audioDurationState);
  const programStartTime = useRecoilValue(clipMomentState.programStartTimeState);
  const programEndTime = useRecoilValue(clipMomentState.programEndTimeState);
  const roomDetails = useRecoilValue(state.roomDetailsState);

  const setCreatingMomentState = useSetRecoilState(clipMomentState.creatingMoment);
  const setCreateMomentModalOpenedState = useSetRecoilState(clipMomentState.createMomentModalOpenedState);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(programEndTime - programStartTime);

  useTrackPlayerEvents([Event.PlaybackProgressUpdated], async (event) => {
    if (event.type === Event.PlaybackProgressUpdated) {
      setCurrentPosition(event.position);
      console.log(currentPosition);
      eventSnapshots.forEach((e: any) => {
        if (e.program_time === Math.round(event.position)) {
          setCurrentEventSnapshot(e);
        }
      });
    }
  });

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Ended) {
      await TrackPlayer.pause();
      await TrackPlayer.seekTo(startPosition);
      await TrackPlayer.play();
    }
  });

  useEffect(() => {
    if (eventSnapshots.length === 0) return;
    const speakers = getMomentSpeakers(eventSnapshots, startPosition, endPosition);
    setSpeakers(speakers);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSnapshots, startPosition, endPosition]);

  useEffect(() => {
    async function updatePosition() {
      await TrackPlayer.seekTo(startPosition);
    }
    updatePosition();
  }, [startPosition]);

  const onSliderChange = (values: number[]) => {
    setStartPosition(values[0]);
    setEndPosition(values[1]);
  };

  const createMoment = useCallback(async () => {
    if (!roomDetails?.id) return;
    if (!title) {
      Toast.show({
        type: 'error',
        text1: 'Enter title!',
      } as CustomShowParams);
      return;
    }
    setCreatingMomentState('UPLOADING');
    const _start = startPosition + programStartTime;
    const _end = endPosition + programStartTime;

    try {
      await api.moment.createMoment({
        room_id: roomDetails?.id,
        start: _start,
        end: _end,
        title: title,
      });
      setCreatingMomentState('SUCCESS');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error occured while creating a moment',
      } as CustomShowParams);
      setCreatingMomentState(null);
      setCreateMomentModalOpenedState(false);
    }
  }, [
    roomDetails,
    startPosition,
    endPosition,
    programStartTime,
    title,
    setCreatingMomentState,
    setCreateMomentModalOpenedState,
  ]);

  const handlePlayPause = useCallback(async () => {
    if (isPlaying) {
      setIsPlaying(false);
      await TrackPlayer.pause();
    } else if (!isPlaying) {
      await TrackPlayer.play();
      setIsPlaying(true);
      const progress = await TrackPlayer.getProgress();
      setAudioDuration(Math.round(progress.duration));
      setEndPosition(Math.round(progress.duration));
    }
  }, [isPlaying, setAudioDuration]);

  return {
    speakers,
    audioDuration,
    startPosition,
    endPosition,
    isPlaying,
    currentPosition,
    onSliderChange,
    handlePlayPause,
    createMoment,
  };
};
