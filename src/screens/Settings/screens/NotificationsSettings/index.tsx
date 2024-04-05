import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import LinkButton from '../../components/LinkButton';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';

const NotificationsSettings = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        titleSize='large'
        title={t('common.notifications')}
      />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <LinkButton navigateTo={() => navigate('PushNotifications')} title={t('settings.pushNotifications')} />
        <LinkButton navigateTo={() => navigate('SMSNotifications')} title={t('settings.smsNotifications')} />
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
});

export default memo(NotificationsSettings);
