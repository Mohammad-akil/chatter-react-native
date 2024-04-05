import { type Dispatch, type FC, type SetStateAction, memo, useCallback } from 'react';
import {
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
  FlatList,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { FadeIn, FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { useSlider } from '~/hooks/useSlider/useSlider';
import { progress } from '~/hooks/useSlider/styles';
import { usePinnedLinks } from '../../queries/usePinnedLinks';
import Skeleton from '~/ui/Skeleton';
import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

export type PinnedData = {
  link: {
    id: string;
    url: string;
    title: string;
    domain: string;
    images: string[];
    favicon: string;
    sitename: string;
    description: string;
  };
};

type PinnedSectionProps = {
  roomId: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  activeSlide?: number;
  style?: StyleProp<ViewStyle>;
};

const PinnedSection: FC<PinnedSectionProps> = ({ roomId, show = true, setShow, activeSlide = 0, style }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { data, isFetching } = usePinnedLinks(roomId);

  const { flatListRef, activeIndex, handleListMount, viewabilityConfigCallbackPairs, itemLayout, interval } =
    useSlider(activeSlide);
  const toggleVisibilityText = show ? t('common.hide') : t('common.show');

  const toggleView = useCallback(() => {
    setShow((prev) => !prev);
  }, [setShow]);

  const renderPinnedSlide: ListRenderItem<PinnedData> = useCallback(
    ({ item }) => {
      const itemStyles: StyleProp<ViewStyle> = [pinnedMessage.base, { width: width - 20 * 2 }];
      return (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.link.url);
          }}
          style={customStyles.listItem}
        >
          <Flex style={itemStyles} flexDirection='row' gap={8}>
            <Avatar
              borderRadius='minimal'
              url={item.link.images && item.link.images.length > 0 ? item.link.images[0] : item.link.favicon}
              size={80}
            />
            <Flex style={pinnedMessage.textContainer} gap={4}>
              <Typography type='body' size='small' color='textSecondary'>
                {item.link.sitename}
              </Typography>
              <Typography type='body' size='medium' numberOfLines={2}>
                {item.link.title}
              </Typography>
              <Typography type='body' size='small' numberOfLines={2}>
                {item.link.description}
              </Typography>
            </Flex>
          </Flex>
        </TouchableOpacity>
      );
    },
    [width],
  );

  if (!data || data.length === 0) {
    return null;
  }

  if (isFetching) {
    return (
      <Flex style={style} gap={16}>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={12}>
            <Skeleton width={75} height={24} borderRadius={6} />
          </Flex>
        </Flex>
        <Skeleton width={'100%'} height={142} borderRadius={6} />
      </Flex>
    );
  }

  return (
    <AnimatedFlex entering={FadeIn.duration(200)} layout={LinearTransition.duration(200)} style={style} gap={16}>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex flexDirection='row' alignItems='center' gap={12}>
          <Typography type='headline' size='small'>
            {t('room.pinned')}
          </Typography>
          <Typography type='label' size='medium'>
            {data.length}
          </Typography>
        </Flex>
        <Button text={toggleVisibilityText} type='text' size='sm' onPress={toggleView} />
      </Flex>

      {show && (
        <AnimatedFlex layout={LinearTransition.duration(200)} entering={FadeInUp} exiting={FadeOutUp} gap={16}>
          <FlatList
            data={data}
            ref={flatListRef}
            horizontal
            decelerationRate={'fast'}
            snapToAlignment='start'
            contentContainerStyle={styles.flatlistContainer}
            snapToInterval={interval}
            onLayout={handleListMount}
            keyExtractor={(item, index) => `${item.link.url}${index}`}
            showsHorizontalScrollIndicator={false}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            getItemLayout={itemLayout}
            disableIntervalMomentum
            pagingEnabled
            renderItem={renderPinnedSlide}
          />
          {data.length > 1 && (
            <Flex flexDirection='row' gap={8}>
              {[
                [...Array(data.length)].map((_, index) => {
                  const styles = index === activeIndex ? [progress.base, progress.active] : progress.base;
                  return <View key={index} style={styles} />;
                }),
              ]}
            </Flex>
          )}
        </AnimatedFlex>
      )}
    </AnimatedFlex>
  );
};

const customStyles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(PinnedSection);

const styles = StyleSheet.create({
  flatlistContainer: { gap: normalize(20) },
});

const pinnedMessage = StyleSheet.create({
  base: {
    padding: normalize(16),
    backgroundColor: colors.surface.surfaceComponent,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    width: '100%',
  },
});
