import { memo, useEffect, useState } from 'react';
import { commonStyles } from '~/styles';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';

import { api } from '~/api';
import Button from '~/ui/Button';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import Flex from '~/ui/Flex';

const Verification = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [result, setResult] = useState('');

  async function launchVerification() {
    const verificationApi = await api.verification.getWidget();

    console.log(result);
    setResult(result);
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('common.settings')} />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex gap={2}>
          <Typography style={styles.subtitle} size='default'>
            {t('settings.notVerified')}
          </Typography>
        </Flex>
        <Button text='Launch Verification' onPress={launchVerification} />
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
    paddingBottom: normalize(80),
  },
  buttonLink: {
    paddingVertical: 8,
  },
  subtitle: {
    maxWidth: '100%',
  },
});

export default memo(Verification);
