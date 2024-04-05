import Flex from '~/ui/Flex';
import SpotlightBlock from '../SpotlightBlock';
import { SpotLightBlockProps } from '../SpotlightBlock/types';
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { memo, useCallback, useRef, useState } from 'react';
import { progress } from '~/hooks/useSlider/styles';
import { spotlightBlockProps } from './mocked';
import Carousel from 'react-native-reanimated-carousel';
import { normalize } from '~/utils/normalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';

const Spotlight = () => {
  const { bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const paginationBottom = [styles.pagination, { bottom: bottom + normalize(80) }];

  const renderItem = useCallback(
    ({ item }: { item: SpotLightBlockProps }) => {
      const contentBottom: StyleProp<ViewStyle> = {
        bottom: bottom + normalize(100),
        flex: 1,
        paddingHorizontal: normalize(20),
        justifyContent: 'flex-end',
      };
      return (
        <Flex flex={1}>
          <FastImage source={require('~/assets/images/discover-background.png')} style={styles.image} />
          <SpotlightBlock style={contentBottom} {...item} />
        </Flex>
      );
    },
    [bottom],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const renderTab = (index: number) => {
    const styles = index === activeIndex ? [progress.base, progress.active] : progress.base;
    return <View key={index} style={[styles]} />;
  };

  return (
    <Flex>
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={height}
        data={spotlightBlockProps}
        scrollAnimationDuration={300}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <View style={paginationBottom}>{spotlightBlockProps.map((_, index) => renderTab(index))}</View>
    </Flex>
  );
};

const styles = StyleSheet.create({
  image: { position: 'absolute', width: '100%', height: '100%' },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    gap: 10,
    paddingHorizontal: normalize(20),
  },
});

export default memo(Spotlight);
