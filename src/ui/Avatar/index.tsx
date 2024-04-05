import { type FC, memo, useState } from 'react';
import { type StyleProp, ImageRequireSource, View, StyleSheet, ViewStyle } from 'react-native';
import FastImage, { ImageStyle, Source } from 'react-native-fast-image';

import { colorPalette } from '~/styles/colors';
import NoPhoto from './components/NoPhoto';
import Skeleton from '../Skeleton';
import { normalize } from '~/utils/normalize';
import Flex from '../Flex';
import Typography from '../Typography';

type AvatarProps = {
  size?: number;
  fallbackIcon?: string;
  borderRadius?: 'full' | 'minimal';
  backgroundColor?: string;
  url: string | null | undefined;
  style?: StyleProp<ImageStyle>;
  borderColor?: string;
  borderWidth?: number;
  borderDistance?: number;
  borderSpacing?: number;
  badge?: string;
};

const Avatar: FC<AvatarProps> = ({
  url,
  fallbackIcon,
  borderRadius = 'full',
  size = 40,
  backgroundColor = colorPalette.grey700,
  borderColor,
  borderWidth,
  style,
  badge = '',
}) => {
  const [imageLoading, setImageLoading] = useState(true);

  const skeletonSize = size + 2;
  const radius = borderRadius === 'full' ? size : 6;
  const source: Source | ImageRequireSource | null = url ? { uri: url } : null;

  const avatarStyles: StyleProp<ImageStyle> = [
    {
      width: normalize(size),
      height: normalize(size),
      borderRadius: radius,
      borderWidth: borderWidth || 0,
      borderColor: borderColor || 'transparent',
    },
    style,
  ];

  const skeletonStyles = [styles.skeleton, style];

  const handleLoadStart = () => {
    setImageLoading(true);
  };
  const handleLoadEnd = () => {
    setImageLoading(false);
  };

  return source ? (
    <View style={styles.imageWrapper}>
      {!!badge && (
        <Flex justifyContent='center' alignItems='center' style={badgeStyle.wrapper}>
          <Typography size='small' color='primary800'>
            {badge}
          </Typography>
        </Flex>
      )}
      <FastImage source={source} onLoadStart={handleLoadStart} onLoadEnd={handleLoadEnd} style={avatarStyles} />
      {imageLoading && (
        <Skeleton style={skeletonStyles} width={skeletonSize} height={skeletonSize} borderRadius={radius} />
      )}
    </View>
  ) : (
    <NoPhoto
      size={size}
      style={style as ViewStyle}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      fallbackIcon={fallbackIcon}
    />
  );
};

export default memo(Avatar);

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    position: 'absolute',
  },
});
const badgeStyle = StyleSheet.create({
  wrapper: {
    position: 'absolute',

    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colorPalette.primary100,
    borderRadius: normalize(100),

    right: -6,
    top: -2,
    zIndex: 999,
  },
});
