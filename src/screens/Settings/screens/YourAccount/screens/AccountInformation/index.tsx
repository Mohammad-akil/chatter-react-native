import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import LinkButton from '../../../../components/LinkButton';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import { useStorageUser } from '~/services/mmkv/auth';
import Button from '~/ui/Button';
import { api } from '~/api';
import SettingsModal from '../../components/SettingsModal';
import { client } from '~/services/websocket';

const AccountInformation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { navigate, reset } = useNavigation();
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      api.auth.logout();
      reset({ index: 0, routes: [{ name: 'Auth' }] });
    }
  }, [isLoggedIn, reset]);

  const logout = useCallback(() => {
    client.disconnect();
    setIsModalOpen(false);
    setIsLoggedIn(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.accountInfo')} />
      <Flex flex={1} justifyContent='space-between'>
        <Flex gap={32} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
          <LinkButton
            title={t('common.username')}
            subtitle={user?.username}
            oneLine
            navigateTo={() => navigate('UpdateUsername')}
          />
          <LinkButton
            title={t('common.phone')}
            oneLine
            subtitle={user?.phone_number}
            navigateTo={() => navigate('UpdatePhone')}
          />
          <LinkButton
            oneLine
            title={t('common.email')}
            subtitle={user?.email}
            navigateTo={() => navigate('UpdateEmail')}
          />
          <LinkButton
            oneLine
            title={t('common.country')}
            subtitle={'Ukraine'}
            navigateTo={() => navigate('UpdateCountry')}
          />
        </Flex>
        <Flex style={commonStyles.baseFooter}>
          <Button text='Log out' type='cancel' style={styles.logoutButton} onPress={openModal} />
        </Flex>
      </Flex>
      {isModalOpen && (
        <SettingsModal
          subtitle={t('common.LogOutOfDevice')}
          title={t('common.areYouSure')}
          logout={logout}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: normalize(16),
    gap: normalize(32),
  },
  logoutButton: { borderWidth: 0 },
});

export default memo(AccountInformation);
