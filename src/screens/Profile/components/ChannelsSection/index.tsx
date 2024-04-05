import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, type ListRenderItem, StyleSheet, FlatList, Pressable } from 'react-native';
import { Channel } from '~/entities/Channel';
import { useTranslation } from 'react-i18next';

import ChannelPreviewCard from '~/components/ChannelPreviewCard';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { User } from '~/entities/User';
import { useNavigation } from '@react-navigation/native';

type ChannelsSectionProps = {
  style?: StyleProp<ViewStyle>;
  channels: Channel[];
  owner: User;
};

const ChannelsSection: FC<ChannelsSectionProps> = ({ style, channels, owner }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const renderItem: ListRenderItem<Channel> = useCallback(({ item }) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('PreviewChannel', { channel_id: item.id });
        }}
      >
        <ChannelPreviewCard title={item.name} avatar={item.avatar} members={item.subscribers} owner={owner.username} />
      </Pressable>
    );
  }, []);
  return (
    <Flex style={style} gap={24}>
      <Typography type='display' size='light'>
        {t('common.channels')}
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

export default memo(ChannelsSection);

const styles = StyleSheet.create({
  flatlistContentContainer: {
    gap: 4,
  },
});
