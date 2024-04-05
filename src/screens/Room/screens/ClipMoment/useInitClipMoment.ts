import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import TrackPlayer from 'react-native-track-player';

import { api } from '~/api';
import { getMomentSpeakers } from './getMomentSpeakers';
import { clipMomentState } from '../../state/clipMomentState';
import { state } from '../../state/roomState';

export const useInitClipMoment = () => {
  const roomDetails = useRecoilValue(state.roomDetailsState);
  const setMomentsScreen = useSetRecoilState(clipMomentState.screenState);

  const setEventSnapshots = useSetRecoilState(clipMomentState.eventSnapshotsState);
  const setMomentSpeakers = useSetRecoilState(clipMomentState.speakersState);
  const setAudioDuration = useSetRecoilState(clipMomentState.audioDurationState);
  const setProgramStartTime = useSetRecoilState(clipMomentState.programStartTimeState);
  const setProgramEndTime = useSetRecoilState(clipMomentState.programEndTimeState);

  const initAudio = useCallback(async (audio_url: string) => {
    await TrackPlayer.reset();
    await TrackPlayer.updateOptions({
      progressUpdateEventInterval: 500,
    });
    await TrackPlayer.load({
      url: audio_url,
    });
    await TrackPlayer.updateOptions({
      progressUpdateEventInterval: 0.5,
    });
  }, []);

  const init = useCallback(async () => {
    if (!roomDetails?.id) return;

    try {
      setMomentsScreen({
        loading: true,
        dataReady: false,
        opened: false,
      });

      const generateMomentResponse = await api.moment.generateAudio(roomDetails.id);

      const eventsResponse = await api.moment.getMomentEvents(
        roomDetails.id,
        generateMomentResponse.data.program_start_time,
        generateMomentResponse.data.program_end_time,
      );

      const users = getMomentSpeakers(
        eventsResponse.data,
        generateMomentResponse.data.program_start_time,
        generateMomentResponse.data.program_end_time,
      );
      setMomentSpeakers(users);
      setEventSnapshots(eventsResponse.data);
      setAudioDuration(generateMomentResponse.data.duration);

      setProgramStartTime(generateMomentResponse.data.program_start_time);
      setProgramEndTime(generateMomentResponse.data.program_end_time);

      await initAudio(generateMomentResponse.data.audio_url);

      setMomentsScreen({
        loading: false,
        dataReady: true,
        opened: false,
      });
    } catch (error: any) {
      console.log(error.message);

      setMomentsScreen({
        loading: false,
        dataReady: false,
        opened: false,
      });
      throw new Error();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomDetails?.id]);

  return {
    init,
  };
};
