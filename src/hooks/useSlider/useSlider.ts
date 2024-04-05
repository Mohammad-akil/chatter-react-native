import { useCallback, useMemo, useRef, useState } from 'react';
import { type ViewToken, type ViewabilityConfigCallbackPairs, useWindowDimensions, FlatList } from 'react-native';
import { normalize } from '~/utils/normalize';

export const useSlider = (activeSlide: number = 0) => {
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(activeSlide);

  const flatListRef = useRef<FlatList>(null);

  const interval = useMemo(() => width - normalize(20), [width]);

  const handleSnap = useCallback(({ changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    setActiveIndex(changed[0].index ?? 0);
  }, []);

  const handleListMount = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      animated: false,
      offset: interval * activeIndex,
    });
  }, [activeIndex, interval]);

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>([
    {
      viewabilityConfig: {
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: normalize(50),
      },
      onViewableItemsChanged: handleSnap,
    },
  ]);

  const itemLayout = useCallback(
    (data: ArrayLike<any> | null | undefined, index: number) => ({
      length: interval,
      offset: interval * index,
      index,
    }),
    [interval],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleListMount,
    viewabilityConfigCallbackPairs,
    itemLayout,
    interval,
    flatListRef,
  };
};
