import { memo, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';
import { useRefreshByUser } from '~/hooks/useRefreshByUser';
import { CustomToastProps } from '~/ui/Toast/types';

import EditImageModal from '~/components/EditImageModal';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileInfo from '../../components/ProfileInfo';
import MomentsSection from '../../components/MomentsSection';
import ChannelsSection from '../../components/ChannelsSection';

import { momentsData } from '../../data';
import { uploadProfileAvatar } from '../../utils/uploadProfileAvatar';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

const Profile = () => {
  const [user] = useStorageUser();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPending, data, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.auth.me(),
    initialData: user,
  });
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

  const choosePhoto = useCallback(async () => {
    try {
      await uploadProfileAvatar();
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsModalOpen(false);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomToastProps);
    }
  }, [setIsModalOpen, queryClient]);

  const removeAvatar = useCallback(async () => {
    try {
      await api.profile.deleteAvatar();
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setIsModalOpen(false);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomToastProps);
    }
  }, [setIsModalOpen, queryClient]);

  if (!data) {
    return <SafeAreaView style={commonStyles.baseSafeArea}></SafeAreaView>;
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ProfileHeader view='owner' style={headerStyles.base} user={user} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />}
      >
        <ProfileInfo view='owner' user={data} setIsModalOpen={setIsModalOpen} loading={isPending} />
        <MomentsSection moments={momentsData} style={section.moments} />
        <ChannelsSection channels={user?.owned_channels as any} owner={user as any} style={section.base} />
        {/* <RecentlyViewed channels={[]} style={section.base} /> */}
        {/* <PastRooms rooms={pastRooms} style={section.base} /> */}
      </ScrollView>
      {isModalOpen && (
        <EditImageModal
          choosePhotoFunc={choosePhoto}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          removePhotoFunc={removeAvatar}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(Profile);

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: normalize(150),
    ...commonStyles.baseScreenPadding,
  },
});

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
