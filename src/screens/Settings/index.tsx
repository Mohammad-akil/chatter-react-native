import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import LinkButton from './components/LinkButton';

const Settings = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex flex={1} style={commonStyles.baseScreenPadding}>
        <ScreenHeader withBackButton={true} title={t('common.settings')} />
        <ScrollView>
          <Flex flex={1} gap={32} style={styles.scrollContent}>
            <LinkButton
              title={t('common.yourAccount')}
              subtitle={t('settings.information')}
              navigateTo={() => navigate('YourAccount')}
            />
            <LinkButton
              title={t('common.security')}
              subtitle={t('settings.manageSecurity')}
              navigateTo={() => navigate('Security')}
            />
            <LinkButton
              title={t('common.monetization')}
              subtitle={t('settings.earnOnChatter')}
              navigateTo={() => navigate('Monetization')}
            />
            <LinkButton
              title={t('common.chatterCreator')}
              subtitle={t('settings.subscriptionSettings')}
              navigateTo={() => navigate('ChatterCreator')}
            />
            <LinkButton
              title={t('common.privacyAndSafety')}
              subtitle={t('settings.controlInformation')}
              navigateTo={() => navigate('PrivacyAndSafety')}
            />
            <LinkButton
              title={t('common.notifications')}
              subtitle={t('settings.customizeNotifications')}
              navigateTo={() => navigate('NotificationsSettings')}
            />
            <LinkButton
              title={t('common.displayAndLanguages')}
              subtitle={t('settings.customizeContent')}
              navigateTo={() => navigate('DisplayAndLanguages')}
            />
            <LinkButton
              title={t('settings.verification')}
              subtitle={t('settings.getVerified')}
              navigateTo={() => navigate('Verification')}
            />
          </Flex>
        </ScrollView>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: normalize(16),
    gap: normalize(32),
  },
});

export default Settings;
