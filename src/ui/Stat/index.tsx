import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { abbreviateNumber } from '~/utils/abbreviateNumber';
import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

type StatPropsBase = {
  style?: StyleProp<ViewStyle>;
  iconName: string;
};

type StatPropsWithTime = {
  time: string;
  count?: never;
  fractionalDigits?: never;
};

type StartPropsWithCount = {
  time?: never;
  count: number;
  fractionalDigits?: number;
};

type StatProps = StatPropsBase & (StatPropsWithTime | StartPropsWithCount);

const Stat: FC<StatProps> = ({ style, iconName, count, fractionalDigits = 2, time }) => {
  return (
    <Flex style={style} flexDirection='row' alignItems='center' gap={4}>
      <Icon name={iconName} size={normalize(16)} color={colors.text.textSecondary} />
      <Typography type='label' size='small' color='textSecondary'>
        {count && abbreviateNumber(count, fractionalDigits)}
        {time && time}
      </Typography>
    </Flex>
  );
};

export default memo(Stat);
