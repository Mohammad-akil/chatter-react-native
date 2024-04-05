import { type FC, memo, useState, useCallback, useMemo, useEffect } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { FadeOut, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import moment from 'moment';

import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

import PollOptions from './PollOptions';
import PollResults from './PollResults';

import { usePoll } from '../../queries/usePoll';
import { state } from '../../state/roomState';

type PollViewProps = {
  style?: StyleProp<ViewStyle>;
  poll_id: string;
};

const PollView: FC<PollViewProps> = ({ style, poll_id }) => {
  const [user] = useStorageUser();
  const { t } = useTranslation();

  const pollTime = useRecoilValue(state.pollTimeState);
  const activePollId = useRecoilValue(state.activePollIdState);

  const { data } = usePoll(poll_id);
  const [expanded, setExpanded] = useState(false);

  const [ticking, setTicking] = useState(!!activePollId);
  const [difference, setDifference] = useState(pollTime! - new Date().getTime());

  const isOwner = useMemo(() => {
    return user?.id === data?.creator.id;
  }, [user, data]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pollTime) {
        setDifference(pollTime - new Date().getTime());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [ticking, pollTime]);

  const closePoll = useCallback(async () => {
    await api.room.endRoomPoll(poll_id);
  }, [poll_id]);

  useEffect(() => {
    if (difference < 500) {
      setTicking(false);
      isOwner && closePoll();
    }
  }, [difference, isOwner, closePoll]);

  const hide = useCallback(() => {
    setExpanded(false);
  }, []);

  const open = useCallback(() => {
    if (expanded) return;
    setExpanded(true);
  }, [expanded]);

  const time = useMemo(() => {
    const _time = moment.utc(difference).format('mm:ss');
    return _time;
  }, [difference]);

  return (
    <TouchableOpacity activeOpacity={!expanded ? 0.8 : 1} onPress={open}>
      <AnimatedFlex layout={LinearTransition.duration(250)} gap={8} style={[styles.base, style]}>
        <AnimatedFlex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Typography type='headline' size='small' color='textLabel'>
            {t('room.poll')}
          </Typography>
          <Flex flexDirection='row' alignItems='center' gap={16}>
            <Typography style={{ width: 40, textAlign: 'center' }} type='label' size='small' color='textSecondary'>
              {time}
            </Typography>
            <Typography type='label' size='small' color='textSecondary'>
              {data?.total_votes || 0} {t('room.responses')}
            </Typography>
            <IconButton
              style={styles.iconButton}
              sizeOfIcon={24}
              type='text'
              iconName='remove-outline'
              size='sm'
              onPress={hide}
            />
          </Flex>
        </AnimatedFlex>
        <Typography type='label' size='medium' color='textDefault'>
          {data?.question}
        </Typography>

        {!isOwner && expanded && (
          <PollOptions
            poll_id={poll_id}
            style={{ marginTop: 8 }}
            results={data?.results}
            total_votes={data?.total_votes || 0}
          />
        )}
        {isOwner && expanded && (
          <PollResults style={{ marginTop: 8 }} results={data?.results} total_votes={data?.total_votes || 0} />
        )}
        {isOwner && expanded && (
          <AnimatedFlex exiting={FadeOut}>
            <Button style={styles.buttonSpacing} size='md' text={t('room.closePoll')} onPress={closePoll} />
          </AnimatedFlex>
        )}
      </AnimatedFlex>
    </TouchableOpacity>
  );
};

export default memo(PollView);

const styles = StyleSheet.create({
  base: {
    left: 20,
    position: 'absolute',
    width: Dimensions.get('window').width - 40,
    overflow: 'hidden',
    backgroundColor: colors.surface.surfaceComponent,
    borderRadius: 6,
    padding: normalize(16),
    bottom: 125,
  },
  resultsTitle: {
    paddingTop: 8,
  },
  iconButton: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  buttonSpacing: {
    marginTop: normalize(16),
  },
});
