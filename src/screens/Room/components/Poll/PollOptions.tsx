import { type FC, memo, useCallback } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';
import { PollOptionResult } from '~/entities/Room';

import Typography from '~/ui/Typography';
import { AnimatedFlex } from '~/ui/Flex';

import OptionResult from './OptionResult';

import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import { useRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type PollOptionsProps = {
  style?: StyleProp<ViewStyle>;
  poll_id: string;
  results?: PollOptionResult[];
  total_votes: number;
};

const PollOptions: FC<PollOptionsProps> = ({ style, poll_id, results, total_votes }) => {
  const { t } = useTranslation();
  const [selectedPollAnswer, setSelectedPollAnswer] = useRecoilState(state.selectedPollAnswerState);

  const vote = useCallback(
    async (id: number) => {
      await api.room.voteInPoll({ poll_id, option: id });
      setSelectedPollAnswer(id);
    },
    [poll_id, setSelectedPollAnswer],
  );

  return (
    <AnimatedFlex gap={8} style={style}>
      <Typography type='label' size='small' color='textSecondary'>
        {t('room.selectYourAnswer')}
      </Typography>
      <>
        {results &&
          results.map((result) => {
            const _vote = () => {
              if (selectedPollAnswer) return;
              vote(result.option);
            };

            const isSelected = result.option === selectedPollAnswer;

            return (
              <TouchableOpacity
                key={result.option}
                onPress={_vote}
                activeOpacity={selectedPollAnswer ? 1 : 0.8}
                style={[styles.optionWrapper, isSelected && styles.selected]}
              >
                <OptionResult
                  selected={isSelected}
                  showResults={!!selectedPollAnswer}
                  option={result}
                  total_votes={total_votes}
                />
              </TouchableOpacity>
            );
          })}
      </>
    </AnimatedFlex>
  );
};

export default memo(PollOptions);

const styles = StyleSheet.create({
  optionWrapper: {
    paddingHorizontal: 8,
    paddingVertical: normalize(16),
    backgroundColor: colorPalette.grey700,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: colorPalette.grey800,
  },
});
