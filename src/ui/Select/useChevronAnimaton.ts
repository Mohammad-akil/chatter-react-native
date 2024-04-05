import { useEffect } from 'react';
import { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const dropdownIconAnimation = { duration: 200 };

export const useChevronAnimation = (menuOpened: boolean) => {
  const iconRotate = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => {
    return { transform: [{ rotateX: `${interpolate(iconRotate.value, [0, 1], [0, 180])}deg` }] };
  });

  useEffect(() => {
    if (menuOpened) {
      iconRotate.value = withTiming(1, dropdownIconAnimation);
    } else {
      iconRotate.value = withTiming(0, dropdownIconAnimation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpened]);

  return {
    iconStyle,
  };
};
