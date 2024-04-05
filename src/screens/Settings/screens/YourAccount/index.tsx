import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import LinkButton from '../../components/LinkButton';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';

const YourAccount = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex flex={1} style={commonStyles.baseScreenPadding}>
        <ScreenHeader withBackButton={true} title={t('common.yourAccount')} />
        <ScrollView>
          <Flex flex={1} gap={32} style={styles.scrollContent}>
            <LinkButton
              title={t('settings.accountInfo')}
              subtitle={t('settings.viewAccDetails')}
              navigateTo={() => navigate('AccountInformation')}
            />
            <LinkButton
              title={t('settings.changeYourPassword')}
              subtitle={t('settings.changeYourPassword') + '.'}
              navigateTo={() => navigate('ChangeYourPassword')}
            />
            <LinkButton
              title={t('settings.deactivateYourAccount')}
              subtitle={t('settings.deactivatingInfo')}
              navigateTo={() => navigate('DeactivateYourAccount')}
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

export default memo(YourAccount);
