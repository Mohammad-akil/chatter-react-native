import { type FC, memo, useEffect, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type SpeakingIndicatorProps = {
  style?: StyleProp<ViewStyle>;
  isSpeaking: boolean;
  size?: number;
  borderRadius?: number;
  audioLevel?: number;
};

const SpeakingIndicator: FC<SpeakingIndicatorProps> = ({
  style,
  isSpeaking,
  size = 80,
  borderRadius = 360,
  audioLevel = 0,
}) => {
  const _size = useMemo(() => normalize(size), [size]);
  const speakingIndicatorSize = useSharedValue(_size);

  useEffect(() => {
    if (isSpeaking) {
      speakingIndicatorSize.value = withTiming(_size + 7, { duration: 100 });
    } else {
      speakingIndicatorSize.value = withTiming(_size, { duration: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpeaking, audioLevel, _size]);

  const speakingIndicatorStyles = useAnimatedStyle(() => {
    return {
      width: speakingIndicatorSize.value,
      height: speakingIndicatorSize.value,
      borderRadius,
    };
  });
  const indicatorStyle = [styles.base, speakingIndicatorStyles, style];

  return <Animated.View style={indicatorStyle}></Animated.View>;
};

export default memo(SpeakingIndicator);

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    borderWidth: 1.5,

    borderColor: colorPalette.primary400,
  },
});
