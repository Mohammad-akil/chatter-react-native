import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';

import { LiveRoomSwiper } from './components/LiveChannelSwiper/LiveChannelSwiper';

import { HomeTab } from './types';
import { commonStyles } from '~/styles';

import { api } from '~/api';

import type { Room } from '~/entities/Room';

import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import ConversationsList from './components/ConversationsList';
import { useQuery } from '@tanstack/react-query';
import { LiveRoomList } from './components/LiveChannelsList';
import { useStorageUser } from '~/services/mmkv/auth';
import MomentsSection from '../Profile/components/MomentsSection';
import { momentsData } from '../Profile/data';
import Flex from '~/ui/Flex';
import SuggestedUsersList from '../Community/components/SuggestedUsersList';
import HomeHeader from './components/HomeHeader';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [counter, setCounter] = useState(0);
  const [user] = useStorageUser();

  useEffect(() => {
    async function fetchNotificationCount() {
      const response = await api.notifications.getNotifications();
      setCounter(response.data.length);
    }
    fetchNotificationCount();
  }, []);

  const [rooms, setRooms] = useState<Room[]>([]);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['conversationsList'],
    queryFn: () => api.conversations.getConversationsList(),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const getRooms = useCallback(async () => {
    const response = await api.room.getRooms();
    if (!response.success) {
      Toast.show({
        type: 'error',
        text1: response.error,
      } as CustomShowParams);
      return;
    }
    setRooms(response.data);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRooms();
    refetch();
    setRefreshing(false);
  }, [getRooms, refetch]);

  useEffect(() => {
    getRooms();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeTab, setActiveTab] = useState<HomeTab>('list');

  const { navigate } = useNavigation();

  const handleGridClick = useCallback(() => setActiveTab('grid'), []);
  const handleListClick = useCallback(() => setActiveTab('list'), []);

  const getTabStyles = useCallback((tab: HomeTab) => ({ borderWidth: tab === activeTab ? 1 : 0 }), [activeTab]);

  const roomsList = useMemo(() => {
    switch (activeTab) {
      case 'grid':
        return <LiveRoomSwiper rooms={rooms} />;
      case 'list':
        return <LiveRoomList rooms={rooms} />;
    }
  }, [activeTab, rooms]);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <HomeHeader>
          <IconButton
            badgeCount={counter}
            type='ghost'
            size='lg'
            iconName='notifications-outline'
            style={styles.headerButtonStyles}
            onPress={() => {
              setCounter(0);
              navigate('Notifications');
            }}
          />
          <IconButton
            type='ghost'
            size='lg'
            iconName='people-circle-outline'
            style={styles.headerButtonStyles}
            onPress={() => navigate('Community')}
          />
          <IconButton
            type='ghost'
            size='lg'
            iconName='chatbubbles-outline'
            style={styles.headerButtonStyles}
            onPress={() => navigate('DirectMessages')}
          />
        </HomeHeader>
        <ConversationsList isPending={isLoading} data={data} />
        {!!user?.following_count && (
          <Flex gap={32}>
            <Flex style={commonStyles.baseScreenPadding}>
              <ScreenHeader titleSize='large' title={t('common.liveNow')}>
                <IconButton
                  type='ghost'
                  iconName='square-outline'
                  borderRadius='minimal'
                  style={getTabStyles('grid')}
                  onPress={handleGridClick}
                />
                <IconButton
                  type='ghost'
                  iconName='list-outline'
                  borderRadius='minimal'
                  onPress={handleListClick}
                  style={getTabStyles('list')}
                />
              </ScreenHeader>
              {roomsList}
            </Flex>
            <MomentsSection componentPadding moments={momentsData} />
            <SuggestedUsersList />
          </Flex>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  suggestedButton: { gap: 4, flexDirection: 'row' },
  headerButtonStyles: {
    borderWidth: 0,
  },
});

export default Home;
