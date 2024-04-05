import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import LinkButton from '~/screens/Settings/components/LinkButton';

const MuteAndBlock = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.MuteAndBlock')} />
      <ScrollView>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <LinkButton
            oneLine
            title={t('settings.blockedAccounts')}
            subtitle='1'
            navigateTo={() => navigate('BlockedAccounts')}
          />
          <LinkButton
            oneLine
            title={t('settings.mutedAccounts')}
            subtitle='1'
            navigateTo={() => navigate('MutedAccounts')}
          />
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
export default memo(MuteAndBlock);
