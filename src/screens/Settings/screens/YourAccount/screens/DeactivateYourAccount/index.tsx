import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import Button from '~/ui/Button';
import Typography from '~/ui/Typography';
import SettingsModal from '../../components/SettingsModal';
import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';

const DeactivateYourAccount = () => {
  const { navigate, reset } = useNavigation();
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      api.auth.logout();
      reset({ index: 0, routes: [{ name: 'Auth' }] });
    }
  }, [isLoggedIn, reset]);

  const logout = useCallback(() => {
    setIsModalOpen(false);
    setIsLoggedIn(false);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.updatePhone')} />
      <ScrollView>
        <Flex gap={28} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
          <Typography>
            {t('settings.ifYouWantChangeUsername')}
            <Typography onPress={() => navigate('UpdateUsername')} color='primary500'>
              {t('settings.linkSettings')}
            </Typography>
            .
          </Typography>
        </Flex>
      </ScrollView>
      <Flex style={commonStyles.baseFooter}>
        <Button text={t('settings.deactivate')} type='cancel' style={styles.deactivateButton} onPress={openModal} />
      </Flex>
      {isModalOpen && (
        <SettingsModal
          subtitle={t('settings.deactivateMyAccount') + '(@' + user?.username + ')'}
          title={t('settings.confirmDeactivation')}
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
    paddingTop: normalize(28),
  },
  deactivateButton: {
    borderWidth: 0,
  },
});

export default memo(DeactivateYourAccount);
