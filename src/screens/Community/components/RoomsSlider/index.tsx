import { useNavigation } from '@react-navigation/native';
import { FC, memo, useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import RoomPreviewCard from '~/components/RoomPreviewCard';
import { Room } from '~/entities/Room';
import { progress } from '~/hooks/useSlider/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
interface IRoomSlider {
  rooms: Room[];
}
const RoomsSlider: FC<IRoomSlider> = ({ rooms }) => {
  const { width } = useWindowDimensions();
  const { navigate } = useNavigation();
  const renderItem = useCallback(
    ({ item }: { item: Room }) => {
      return (
        <Pressable
          style={styles.itemGap}
          key={item.id}
          onPress={() => navigate('RoomNavigator', { room_id: item.id, action_type: 'join' })}
        >
          <RoomPreviewCard key={item.id} room={item} isList={true} />
        </Pressable>
      );
    },
    [navigate],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const renderTab = (index: number) => {
    const styles = index === activeIndex ? [progress.base, progress.active] : progress.base;
    return <View key={index} style={styles} />;
  };

  return (
    <Flex gap={16}>
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width - normalize(30)}
        height={normalize(150)}
        data={rooms}
        scrollAnimationDuration={300}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <View style={styles.pagination}>{rooms.map((_, index) => renderTab(index))}</View>
    </Flex>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    gap: normalize(10),
  },
  itemGap: { paddingRight: normalize(10) },
});
export default memo(RoomsSlider);
