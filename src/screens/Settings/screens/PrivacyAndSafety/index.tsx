import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import LinkButton from '../../components/LinkButton';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';

const PrivacyAndSafety = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('common.privacyAndSafety')} />
      <ScrollView>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <LinkButton
            navigateTo={() => navigate('Content')}
            title={t('settings.content')}
            subtitle={t('settings.editPrefereces')}
          />
          <LinkButton
            navigateTo={() => navigate('MuteAndBlock')}
            title={t('settings.MuteAndBlock')}
            subtitle={t('settings.manageTheAccounts')}
          />
          <LinkButton
            navigateTo={() => navigate('DirectMessagesSettings')}
            title={t('common.directMessages')}
            subtitle={t('settings.manageWhoCanMessage')}
          />
          <LinkButton
            navigateTo={() => navigate('DiscoverabilityAndContacts')}
            title={t('settings.discoverility')}
            subtitle={t('settings.controlWhoCanFind')}
          />
          <Flex gap={16}>
            <Typography style={styles.buttonLink} onPress={() => {}} size='semibold' color='primary500'>
              {t('common.privacyPolicy')}
            </Typography>
            <Typography style={styles.buttonLink} onPress={() => {}} size='semibold' color='primary500'>
              {t('common.contactUs')}
            </Typography>
            <Typography style={styles.buttonLink} onPress={() => {}} size='semibold' color='primary500'>
              {t('common.termsOfUse')}
            </Typography>
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
  buttonLink: {
    paddingVertical: 8,
  },
});
export default memo(PrivacyAndSafety);
