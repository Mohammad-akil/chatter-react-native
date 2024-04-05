import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '~/navigation';
import { commonStyles } from '~/styles';
import ChannelHeader from '../../components/ChannelHeader';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

import { api } from '~/api';

import ChannelInfo from '../../components/ChannelInfo';
import ChannelTabs from '../../components/ChannelTabs';
import { normalize } from '~/utils/normalize';
import { useQuery } from '@tanstack/react-query';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';

const PreviewChannel = ({ route }: NativeStackScreenProps<RootStackParamList, 'PreviewChannel'>) => {
  const { channel_id } = route.params;

  const { isPending, data, refetch } = useQuery({
    queryKey: ['previewChannel', channel_id],
    queryFn: () => api.channel.getChannel(channel_id),
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  if (!data) {
    return <SafeAreaView style={commonStyles.baseSafeArea}></SafeAreaView>;
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ChannelHeader style={styles.header} view='preview' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={commonStyles.baseScrollView}
        contentContainerStyle={styles.contentScroll}
        refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
      >
        <ChannelInfo
          view='preview'
          channel={data.channel}
          isFollowing={data.metadata.is_following}
          leadersImages={[
            'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
            'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
            'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
            'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
          ]}
        />
        <ChannelTabs view='preview' style={styles.channelTabs} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(PreviewChannel);

const styles = StyleSheet.create({
  header: {
    ...commonStyles.baseScreenPadding,
    paddingVertical: normalize(24),
  },
  channelTabs: {
    flexGrow: 1,
    minHeight: normalize(350),
  },
  contentScroll: {
    gap: normalize(24),
  },
});
