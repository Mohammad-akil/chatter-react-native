import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { normalize } from '~/utils/normalize';

const useKeyboardVisibility = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const animatedPaddingTop = useSharedValue(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      (event) => {
        setIsKeyboardActive(true);
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setIsKeyboardActive(false);
        setKeyboardHeight(0);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [keyboardHeight]);

  useEffect(() => {
    if (isKeyboardActive) {
      animatedPaddingTop.value = withSpring(keyboardHeight - normalize(32), {
        dampingRatio: 0.75,
      });
    } else {
      animatedPaddingTop.value = withSpring(0, {
        dampingRatio: 0.8,
      });
    }
  }, [animatedPaddingTop, isKeyboardActive, keyboardHeight]);
  const animatedBottom = useAnimatedStyle(() => {
    return {
      paddingBottom: Platform.OS === 'ios' ? animatedPaddingTop.value : animatedPaddingTop.value - 30,
    };
  });

  return { isKeyboardActive, keyboardHeight, animatedBottom };
};

export default useKeyboardVisibility;
