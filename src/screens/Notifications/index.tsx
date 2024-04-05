import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import NotificationCategory from './components/NotificationCategory';
import ScreenHeader from '~/components/ScreenHeader';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { getCategoryTitleBySlug, groupNotificationsByCategory } from './utils';
import { normalize } from '~/utils/normalize';
import { fonts } from '~/styles/fonts';

import { api } from '~/api';
import { useNavigation } from '@react-navigation/native';
// import { useStorage } from '~/services/mmkv/config';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    async function fetchNotifications() {
      const notificationsRequest = await api.notifications.getNotifications();
      setNotifications(notificationsRequest.data);
    }
    fetchNotifications();
  }, [setNotifications]);
  const notificationsCategories = useMemo(() => groupNotificationsByCategory(notifications), [notifications]);

  const scrollContainerStyles = useMemo(() => {
    return [styles.scrollContainer, notifications.length === 0 && commonStyles.flexCenter];
  }, [notifications]);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader withBackButton style={commonStyles.baseScreenPadding} title='Notifications' />
      <ScrollView contentContainerStyle={scrollContainerStyles}>
        {notifications.length ? (
          <Flex flex={1}>
            {Object.entries(notificationsCategories).map(([slug, notifications]) => {
              return (
                <NotificationCategory key={slug} title={getCategoryTitleBySlug(slug)} notifications={notifications} />
              );
            })}
          </Flex>
        ) : (
          <View style={styles.empty}>
            <Typography type='label' size='large' style={styles.emptyTitle}>
              No updates. Discover new people and channels to receive notifications and updates.
            </Typography>
            <Button
              type='ghost'
              text='Discover'
              iconName='flashlight-outline'
              iconPosition='right'
              onPress={() => navigation.navigate('Discover')}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: normalize(100),
  },
  empty: {
    alignItems: 'center',
    gap: normalize(24),
  },
  emptyTitle: {
    maxWidth: normalize(320),
    fontFamily: fonts.aeonik.regular,
    textAlign: 'center',
  },
});
