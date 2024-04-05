import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, type ListRenderItem, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Channel } from '~/entities/Channel';

import ChannelDisplayCard from '~/components/ChannelDisplayCard';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

type RecentlyViewedProps = {
  style?: StyleProp<ViewStyle>;
  channels: Channel[];
};

const RecentlyViewed: FC<RecentlyViewedProps> = ({ style, channels }) => {
  const { t } = useTranslation();
  const renderItem: ListRenderItem<Channel> = useCallback(({ item }) => {
    return <ChannelDisplayCard title={item.name} avatar={item.avatar} />;
  }, []);
  return (
    <Flex style={style} gap={16}>
      <Typography type='headline' size='small'>
        {t('profile.recentlyViewed')}
      </Typography>
      <FlatList
        data={channels}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatlistContentContainer}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default memo(RecentlyViewed);

const styles = StyleSheet.create({
  flatlistContentContainer: {
    gap: 4,
  },
});
