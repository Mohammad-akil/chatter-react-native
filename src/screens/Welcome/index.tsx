import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import { styles } from './styles';

const Welcome = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('Drawer');
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Typography type='headline' size='medium'>
        {t('welcome.title')}
      </Typography>
      <Typography type='headline' size='light' style={styles.description}>
        {t('welcome.description')}
      </Typography>
    </SafeAreaView>
  );
};

export default Welcome;
