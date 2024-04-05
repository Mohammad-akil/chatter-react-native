import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { HeaderSlider } from '../../components/HeaderSlider';
import RoomsSlider from '../../components/RoomsSlider';
import { Room } from '~/entities/Room';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import { normalize } from '~/utils/normalize';
import MomentsSlider from '../../components/MomentsSlider';
import CurrentRoomsList from '../../components/CurrentRoomsList';
import { colorPalette } from '~/styles/colors';
import ScheduledRoomsList from '../../components/ScheduledRoomsList';
import SuggestedUsersList from '../../components/SuggestedUsersList';
import SuggestedChannelsList from '../../components/SuggestedChannelsList';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Community = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const [rooms, setRooms] = useState<Room[]>([]);

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

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generalContainer = { paddingBottom: normalize(44) + bottom };
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        titleSize='small'
        withBackButton
        title={t('common.community')}
        style={commonStyles.baseScreenPadding}
      >
        <Flex gap={8} flexDirection='row' alignItems='center'>
          <Typography type='label' size='small'>
            {t('common.findFriends')}
          </Typography>
          <IconButton iconName='people-sharp' />
          <IconButton
            iconName='search'
            onPress={() => {
              navigate('DiscoverSearch');
            }}
          />
        </Flex>
      </ScreenHeader>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex style={generalContainer}>
          <Flex>
            <HeaderSlider />
          </Flex>
          <Flex gap={56}>
            <Flex style={commonStyles.baseScreenPadding} gap={16}>
              <Typography type='headline' size='medium'>
                {t('common.joinYourFriends')}
              </Typography>
              <RoomsSlider rooms={rooms} />
            </Flex>
            <Flex style={commonStyles.baseScreenPadding} gap={24}>
              <Flex gap={4}>
                <Typography type='headline' size='medium'>
                  {t('common.communityHighlights')}
                </Typography>
                <Typography type='body' size='medium' color='grey300'>
                  {t('common.watchMoments')}
                </Typography>
              </Flex>
              <MomentsSlider />
            </Flex>
            <Flex style={commonStyles.baseScreenPadding}>
              <Flex gap={4} style={styles.title}>
                <Typography type='headline' size='medium'>
                  {t('common.upcomingRooms')}
                </Typography>
                <Typography type='body' size='medium' color='grey300'>
                  {t('common.rspvnRooms')}
                </Typography>
              </Flex>
              <Flex gap={16}>
                <Typography type='headline' size='small'>
                  {t('common.today')}
                </Typography>
                <CurrentRoomsList rooms={rooms} />
              </Flex>
              <Flex style={styles.subtitlePadding}>
                <Flex style={styles.separator} />
              </Flex>
              <Flex gap={16}>
                <Typography type='headline' size='small'>
                  {t('common.laterThisWeek')}
                </Typography>
                <ScheduledRoomsList rooms={rooms} />
              </Flex>
            </Flex>
            <Flex style={commonStyles.baseScreenPadding} gap={20}>
              <SuggestedUsersList />
            </Flex>
            <Flex style={commonStyles.baseScreenPadding} gap={20}>
              <Flex>
                <Typography type='headline' size='small'>
                  {t('common.suggestedChannels')}
                </Typography>
              </Flex>
              <SuggestedChannelsList />
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: { paddingBottom: normalize(32) },
  subtitlePadding: {
    paddingVertical: normalize(24),
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colorPalette.grey100,
  },
  suggestedButton: { gap: 4, flexDirection: 'row' },
});

export default memo(Community);
