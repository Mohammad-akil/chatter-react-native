import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import LinkButton from '../../components/LinkButton';
import { useNavigation } from '@react-navigation/native';

const Security = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('common.security')} />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <LinkButton
          navigateTo={() => navigate('Security')}
          title={t('settings.connectedAccounts')}
          subtitle={t('settings.manageLinkedAcc')}
        />
        <LinkButton
          navigateTo={() => navigate('Security')}
          title={t('settings.IdVerefication')}
          subtitle={t('settings.comingSoon')}
          disabled
        />
      </Flex>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
});

export default memo(Security);
