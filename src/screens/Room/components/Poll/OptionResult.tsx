import { type FC, memo, useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { PollOptionResult } from '~/entities/Room';

import ProgressBar from '~/ui/ProgressBar';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

type OptionResultProps = {
  style?: StyleProp<ViewStyle>;
  option: PollOptionResult;
  selected?: boolean;
  showResults?: boolean;
  total_votes: number;
};

const OptionResult: FC<OptionResultProps> = ({ option, selected, total_votes, showResults }) => {
  const percentage = useMemo(() => {
    return Math.round(total_votes > 0 ? (option.count * 100) / total_votes : 0);
  }, [option, total_votes]);

  return (
    <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
      <Flex gap={8} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography type='label' size='large' color='textDefault'>
          {option.text}
        </Typography>
        {selected && <Icon color={colors.text.textBrand} name='radio-button-on' />}
      </Flex>
      {showResults && (
        <Flex style={{ width: normalize(145) }} gap={4} alignItems='flex-end'>
          <Typography type='label' size='small' color='textSecondary'>
            {option.count} ({percentage}%)
          </Typography>
          <ProgressBar progress={percentage} color={selected ? 'textBrand' : 'textDefault'} />
        </Flex>
      )}
    </Flex>
  );
};

export default memo(OptionResult);
