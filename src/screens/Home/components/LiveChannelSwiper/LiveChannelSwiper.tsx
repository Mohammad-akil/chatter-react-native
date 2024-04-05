import { type FC, memo, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import type { Room } from '~/entities/Room';

import RoomPreviewCard from '~/components/RoomPreviewCard';
import { normalize } from '~/utils/normalize';

type LiveRoomSwiperProps = {
  rooms: Room[];
};

export const LiveRoomSwiper: FC<LiveRoomSwiperProps> = memo(({ rooms }) => {
  const { width } = useWindowDimensions();

  const renderItem = useCallback(({ item }: { item: Room }) => {
    return <RoomPreviewCard isList={false} room={item} />;
  }, []);

  return (
    <Carousel
      loop={false}
      width={width - 40}
      height={normalize(350)}
      autoPlay={false}
      data={rooms}
      scrollAnimationDuration={1000}
      renderItem={renderItem}
    />
  );
});
