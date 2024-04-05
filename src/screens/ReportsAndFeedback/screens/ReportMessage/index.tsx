import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation';

const ReportMessage = ({ route }: NativeStackScreenProps<RootStackParamList, 'ReportMessage'>) => {
  const { navigate } = useNavigation();
  const { title, message } = route.params;
  const { t } = useTranslation();

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex justifyContent='space-between' flex={1} style={commonStyles.baseScreenPadding}>
        <ScreenHeader title={t('common.feedbackReceived')} />
        <Flex justifyContent='center' alignItems='center'>
          <Typography textAlign='center'>{t('common.thankYouForFeedback')}</Typography>
        </Flex>
        <Flex style={styles.buttonPadding}>
          <Button text={t('common.done')} onPress={() => navigate('Main')} />
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonPadding: { paddingBottom: normalize(40) },
});

export default memo(ReportMessage);
