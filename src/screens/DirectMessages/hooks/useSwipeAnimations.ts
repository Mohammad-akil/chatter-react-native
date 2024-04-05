import { useMemo } from 'react';
import { Animated } from 'react-native';
import { ConversationType } from '~/entities/DirectMessages';

export const useSwipeAnimations = (conversationsList: ConversationType[]) => {
  const swipeAnimations = useMemo(
    () =>
      conversationsList?.reduce(
        (acc: any, item: ConversationType) => ({
          ...acc,
          [item.dmBoxId]: new Animated.Value(0),
        }),
        {},
      ),
    [conversationsList],
  );

  return swipeAnimations;
};
