import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { RecordingStatus } from '~/hooks/useAudioRecorder/types';
import { RecordState } from '~/hooks/useAudioRecorder/useAudioRecorder';

import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

interface ControlsHeaderProps {
  recordState: RecordState;
  status: RecordingStatus;
  isReply: boolean;
}

const ControlsHeader: FC<ControlsHeaderProps> = ({ recordState, status, isReply }) => {
  const { t } = useTranslation();
  return (
    <Flex justifyContent='center' alignItems='center' style={styles.header}>
      {recordState.recordTime && !recordState.currentPositionSec ? (
        <Typography type='headline' size='light'>
          {recordState.recordTime.toString()}s
        </Typography>
      ) : status === 'playing' || status === 'paused' || status === 'finished' ? (
        <Typography type='headline' size='light'>
          {recordState.playTime}s
        </Typography>
      ) : isReply ? (
        <Typography type='headline' size='light'>
          {t('common.holdToAdd')}
        </Typography>
      ) : (
        <Typography type='headline' size='light'>
          {t('common.holdToSpeak')}
        </Typography>
      )}
    </Flex>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: normalize(10),
  },
});

export default memo(ControlsHeader);
