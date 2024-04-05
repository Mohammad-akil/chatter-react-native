import { type FC, memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type NoPhotoProps = {
  size: number;
  fallbackIcon?: string;
  backgroundColor: string;
  borderRadius: 'full' | 'minimal';
  style?: ViewStyle;
};

const NoPhoto: FC<NoPhotoProps> = ({ size, borderRadius, backgroundColor, fallbackIcon = 'person', style }) => {
  const radius = borderRadius === 'full' ? 100 : 6;
  const iconSize = size / 2.5;

  const containerStyles: StyleProp<ViewStyle> = [
    {
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      width: normalize(size),
      height: normalize(size),
      borderRadius: radius,
    },
    style,
  ];

  return (
    <View style={containerStyles}>
      <Icon name={fallbackIcon} size={normalize(iconSize)} color={colorPalette.grey300} />
    </View>
  );
};

export default memo(NoPhoto);
