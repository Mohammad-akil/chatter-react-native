import { memo } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import { api } from '~/api';
import { RootStackParamList } from '~/navigation';

import ChannelsSection from '../../components/ChannelsSection';
import MomentsSection from '../../components/MomentsSection';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileInfo from '../../components/ProfileInfo';
import { channelsData, momentsData } from '../../data';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';
import { useQuery } from '@tanstack/react-query';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';
import { OwnedChannel } from '~/entities/User';

const PreviewProfile = ({ route }: NativeStackScreenProps<RootStackParamList, 'PreviewProfile'>) => {
  const { user_id } = route.params;

  const { isPending, data, refetch } = useQuery({
    queryKey: ['previewProfile', user_id],
    queryFn: () => api.profile.getProfile(user_id),
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  if (!data) {
    return <SafeAreaView style={commonStyles.baseSafeArea}></SafeAreaView>;
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      {/* @ts-ignore */}
      <ProfileHeader view='preview' style={headerStyles.base} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInset={{ bottom: 200 }}
        refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
        style={commonStyles.baseScrollView}
      >
        <ProfileInfo
          view='preview'
          user={data.user}
          isFollowing={data.metadata.is_following}
          loading={isPending}
          style={{ flexGrow: 1 }}
        />
        {!isPending && (
          <>
            <MomentsSection moments={momentsData} style={section.moments} />
            <ChannelsSection
              channels={data?.user.owned_channels as any}
              owner={data?.user as any}
              style={{ ...section.base, marginBottom: 200 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(PreviewProfile);

const headerStyles = StyleSheet.create({
  base: {
    paddingTop: normalize(20),
    paddingBottom: normalize(24),
    ...commonStyles.baseScreenPadding,
  },
});

const section = StyleSheet.create({
  base: {
    paddingTop: normalize(56),
  },
  moments: {
    paddingTop: normalize(32),
  },
});
