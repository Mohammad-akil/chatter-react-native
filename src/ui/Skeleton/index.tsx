import { type FC, memo, useEffect } from 'react';
import { type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type PercentageSize = `${number}%`;

type SkeletonProps = {
  width: number | PercentageSize;
  height: number | PercentageSize;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

const Skeleton: FC<SkeletonProps> = ({ width, height, borderRadius, style }) => {
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colorPalette.grey800, colorPalette.grey750]),
  }));

  useEffect(() => {
    progress.value = withRepeat(withTiming(1 - progress.value, { duration: 700 }), -1, true);

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, []);

  const baseStyles = {
    width: typeof width === 'number' ? normalize(width) : width,
    height: typeof height === 'number' ? normalize(height) : height,
    borderRadius: borderRadius,
  };

  return <Animated.View style={[baseStyles, animatedStyle, style]} />;
};

export default memo(Skeleton);
