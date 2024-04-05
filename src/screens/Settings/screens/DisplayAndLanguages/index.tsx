import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import LinkButton from '../../components/LinkButton';
import { normalize } from '~/utils/normalize';

const DisplayAndLanguages = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('common.displayAndLanguages')}
      />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <LinkButton navigateTo={() => navigate('DisplayAndSound')} title={t('settings.displayAndSound')} />
        <LinkButton navigateTo={() => navigate('Language')} title={t('settings.language')} />
      </Flex>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
});
export default memo(DisplayAndLanguages);
