import { useCallback } from 'react';
import { Animated } from 'react-native';

export const useSwipeDeleteAnimation = () => {
  const swipeDeleteAnimation = useCallback(
    (animatedValue: Animated.Value, toValue: number, duration: number, callback: () => void) => {
      animatedValue.addListener(() => {
        return;
      });

      Animated.timing(animatedValue, {
        toValue,
        duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          callback();
          animatedValue.removeAllListeners();
        }
      });
    },
    [],
  );

  return swipeDeleteAnimation;
};
