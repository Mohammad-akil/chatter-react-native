import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import LinkButton from '../../components/LinkButton';

const ChatterCreator = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('common.chatterCreator')} />
      <Flex style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <LinkButton
          navigateTo={() => navigate('ConnectedSocials')}
          title={t('settings.connectedSocials')}
          subtitle={t('settings.manageSocial')}
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

export default memo(ChatterCreator);
