import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import MomentPreviewCard from '~/components/MomentPreviewCard';
import { momentsData } from '~/screens/Profile/data';

interface Moments {
  id: number;
  title: string;
  viewed: number;
  liked: number;
  previewVideo: string;
}

const MomentsSlider = () => {
  const renderItem: ListRenderItem<Moments> = useCallback(({ item }) => {
    return (
      <MomentPreviewCard title={item.title} viewed={item.viewed} liked={item.liked} previewVideo={item.previewVideo} />
    );
  }, []);
  return (
    <FlatList
      data={momentsData}
      horizontal
      contentContainerStyle={{ gap: 4 }}
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};
export default memo(MomentsSlider);
