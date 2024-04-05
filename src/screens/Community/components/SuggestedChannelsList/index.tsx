import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import ChannelDisplayCard from '~/components/ChannelDisplayCard';
import { Channel } from '~/entities/Channel';
import { channelsData } from '~/screens/Profile/data';

const SuggestedChannelsList = () => {
  const renderItem: ListRenderItem<Channel> = useCallback(({ item }) => {
    return <ChannelDisplayCard title={item.name} avatar={item.avatar} />;
  }, []);
  return (
    <FlatList
      data={channelsData}
      horizontal
      contentContainerStyle={{ gap: 4 }}
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};
export default memo(SuggestedChannelsList);
