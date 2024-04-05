import { memo, type FC } from 'react';
import { type StyleProp, type ViewStyle, View } from 'react-native';

import { normalize } from '~/utils/normalize';
import { allColors } from '~/styles/colors';

type CircleDividerProps = {
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: keyof typeof allColors;
};

const CircleDivider: FC<CircleDividerProps> = ({ style, size = 6, color = 'textSecondary' }) => {
  const _size = size < 10 ? size : normalize(size);
  const styles = [{ width: _size, height: _size, borderRadius: _size, backgroundColor: allColors[color] }, style];

  return <View style={styles} />;
};

export default memo(CircleDivider);
