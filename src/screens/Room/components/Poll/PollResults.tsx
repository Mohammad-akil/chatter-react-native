import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { PollOptionResult } from '~/entities/Room';

import Typography from '~/ui/Typography';
import { AnimatedFlex } from '~/ui/Flex';

import OptionResult from './OptionResult';

type PollResultsProps = {
  style?: StyleProp<ViewStyle>;
  results?: PollOptionResult[];
  total_votes: number;
};

const PollResults: FC<PollResultsProps> = ({ results, total_votes }) => {
  const { t } = useTranslation();
  return (
    <AnimatedFlex exiting={FadeOut} gap={8}>
      <Typography type='label' size='small' color='textSecondary'>
        {t('common.results')}
      </Typography>
      <>
        {results &&
          results.map((result) => {
            return <OptionResult showResults key={result.option} option={result} total_votes={total_votes} />;
          })}
      </>
    </AnimatedFlex>
  );
};

export default memo(PollResults);
