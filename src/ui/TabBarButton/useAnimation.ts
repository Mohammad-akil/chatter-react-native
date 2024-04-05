import { useCallback, useEffect, useRef, useState } from 'react';
import { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const buttonAnimationOptions = {
  mass: 1,
  damping: 15,
  stiffness: 100,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const useAnimation = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const plusIconRotate = useSharedValue(0);

  const buttonContainerYPosition = useSharedValue(0);
  const buttonContainerOpacity = useSharedValue(0);

  const leftButtonXPosition = useSharedValue(100);
  const rightButtonXPosition = useSharedValue(-100);

  const animatedButtonContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: buttonContainerYPosition.value }],
      opacity: buttonContainerOpacity.value,
    };
  });

  const leftButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: leftButtonXPosition.value }],
    };
  });

  const rightButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: rightButtonXPosition.value }],
    };
  });

  const plusIconStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${interpolate(plusIconRotate.value, [0, 1], [0, 45])}deg` }] };
  });

  const openModal = useCallback(() => {
    plusIconRotate.value = withSpring(1);

    // FADEIN UP BUTTONS CONTAINER
    buttonContainerYPosition.value = withSpring(-52, buttonAnimationOptions);
    buttonContainerOpacity.value = withTiming(1);

    // PLACE BUTTONS TO THE SIDES
    leftButtonXPosition.value = withSpring(0, buttonAnimationOptions);
    rightButtonXPosition.value = withSpring(0, buttonAnimationOptions);

    setModalVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback((onCloseModal?: () => void) => {
    plusIconRotate.value = withSpring(0, { duration: 400 });

    // FADEOUT DOWN BUTTONS CONTAINER
    buttonContainerYPosition.value = withSpring(0);
    buttonContainerOpacity.value = withTiming(0);

    // LEFT AND RIGHT BUTTONS TO INITIAL POSITION
    leftButtonXPosition.value = withSpring(100);
    rightButtonXPosition.value = withSpring(-100);

    animationTimeoutRef.current = setTimeout(() => {
      setModalVisible(false);
      onCloseModal?.();
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !modalVisible && animationTimeoutRef.current && clearTimeout(animationTimeoutRef.current);
  }, [modalVisible]);

  return {
    modalVisible,
    openModal,
    closeModal,
    plusIconStyle,
    animatedButtonContainerStyle,
    leftButtonStyle,
    rightButtonStyle,
  };
};
