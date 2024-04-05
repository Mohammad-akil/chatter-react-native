import { FC, memo } from 'react';
import { Text } from 'react-native';

import { allColors } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { TypographyProps } from './types';

const Typography: FC<TypographyProps> = ({
  type = 'body',
  size = 'medium',
  color = 'grey100',
  textAlign,
  children,
  style,
  ...props
}) => {
  return (
    <Text
      // @ts-ignore
      style={[typography[type][size], { color: allColors[color], textAlign }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default memo(Typography);
