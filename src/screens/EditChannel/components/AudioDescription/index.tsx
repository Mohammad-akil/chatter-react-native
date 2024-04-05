import { type FC, memo, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import { normalize } from '~/utils/normalize';

import type { AudioDescriptionProps } from './types';
import useAudioRecorder from '~/hooks/useAudioRecorder/useAudioRecorder';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';

const AudioDescription: FC<AudioDescriptionProps> = ({ status = 'recording', setStatus, setAudioDescription }) => {
  const { t } = useTranslation();
  const [user] = useStorageUser();

  const deleteAudioDescription = useMutation({
    mutationFn: () => api.profile.deleteAudioDescription(),
  });

  const { onStartPlay, onPausePlay, onResumePlay, onStartRecord, onStopRecord, recordState } = useAudioRecorder(
    setStatus,
    setAudioDescription,
  );

  const secondButtonIcon = useMemo(() => {
    switch (status) {
      case 'recorded':
        return 'play';
      case 'recording':
        return 'mic-outline';
      case 'paused':
        return 'play';
      case 'playing':
        return 'pause';
      default:
        return 'mic-outline';
    }
  }, [status]);

  const secondButtonStyle = useMemo(() => {
    switch (status) {
      case 'recording':
        return { borderWidth: 1, borderColor: 'white' };
    }
  }, [status]);

  const handleButtonPress = () => {
    switch (status) {
      case 'recorded':
        onStartPlay();
        break;
      case 'paused':
        onStartPlay();
        break;
      case 'playing':
        onPausePlay();
        break;
      case 'unrecorded':
        setStatus('recording');
        onStartRecord();
        break;
    }
  };

  useEffect(() => {
    console.log(status);
  }, [status]);

  const isTextShown = status !== 'unrecorded' ? { opacity: 0 } : { opacity: 1 };

  const handleButtonRelease = () => {
    onStopRecord();
  };

  const handleDelete = () => {
    deleteAudioDescription.mutate();
  };

  useEffect(() => {
    if (deleteAudioDescription.isSuccess) {
      console.log(deleteAudioDescription.data);
    }
  }, [deleteAudioDescription.data, deleteAudioDescription.isSuccess]);

  const audioTime =
    status === 'playing' || status === 'paused'
      ? recordState.currentPositionSec
      : recordState.currentDurationSec?.toString()?.slice(3, 5);
  return (
    <Flex gap={4}>
      <Flex flexDirection='row' justifyContent='space-between' style={{ paddingBottom: 10 }}>
        <Typography type='body'>{t('editChannel.audioDescription')}</Typography>
        {!!audioTime && (
          <Typography style={styles.recordButton} type='headline' size='small'>
            {audioTime}s
          </Typography>
        )}
      </Flex>

      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography style={isTextShown} type='label' size='medium' color='textLabel'>
          {t('common.pressAndHoldToRecord')}
        </Typography>
        <Flex alignItems='center' gap={10} flexDirection='row'>
          {user?.profile_audio_description && (
            <IconButton type='delete' transparent iconName='trash-outline' size='3xl' onPress={handleDelete} />
          )}
          <IconButton
            iconName={secondButtonIcon}
            size='3xl'
            style={secondButtonStyle}
            delayLongPress={200}
            onLongPress={status === 'unrecorded' ? handleButtonPress : null}
            onPressOut={handleButtonRelease}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(AudioDescription);

const styles = StyleSheet.create({
  recordButton: {
    paddingRight: normalize(16),
  },
});
