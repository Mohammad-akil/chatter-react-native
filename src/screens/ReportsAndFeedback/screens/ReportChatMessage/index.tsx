import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import SelectInput, { SelectOption } from '~/components/SelectInput';
import { RootStackParamList } from '~/navigation';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import { TextArea } from '~/ui/TextArea';
import Typography from '~/ui/Typography';

const ReportChatMessage = ({ route }: NativeStackScreenProps<RootStackParamList, 'ReportChatMessage'>) => {
  const [selectedOption, setSelectedOption] = useState<SelectOption>();
  const [descriptionValue, setDescriptionValue] = useState<string>();
  const { user, message } = route.params;
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();

  const options = [
    { label: t('common.harmfulContent'), value: 'harmful content' },
    { label: t('common.spam'), value: 'spam' },
    { label: t('common.thirdReason'), value: 'third reason' },
  ];

  const onChangeTextHandle = useCallback((text: string) => {
    setDescriptionValue(text);
  }, []);

  const sendReport = useCallback(() => {
    navigate('ReportMessage', {
      title: t('common.messageReported'),
      message: t('common.yourReportHasBeenReceived'),
    });
    setDescriptionValue(undefined);
    setSelectedOption(undefined);
  }, [navigate, t]);

  const onBackHandle = useCallback(() => {
    goBack();
    setDescriptionValue(undefined);
    setSelectedOption(undefined);
  }, [goBack]);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex style={commonStyles.baseScreenPadding}>
        <ScreenHeader withBackButton onBack={onBackHandle} backIcon='close-outline' title={t('common.reportMessage')}>
          <IconButton iconName='send' type='primary' onPress={sendReport} />
        </ScreenHeader>
        <Flex gap={40}>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Avatar size={48} url={'https://i.pinimg.com/736x/78/48/29/7848297c04b1d0f4d927b8b9047d7631.jpg'} />
              <Flex justifyContent='center'>
                <Typography style={styles.textPadding} type='label' size='medium'>
                  Yasmine Doe
                </Typography>

                <Typography style={styles.textPadding} color='grey300' type='label' size='small'>
                  @yasmine
                </Typography>
              </Flex>
            </Flex>
          </Flex>
          <SelectInput
            options={options}
            selectKey='feedback'
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            label={t('common.reasonForReporting')}
          />
          <Flex gap={12}>
            <Typography type='label' size='medium'>
              {t('common.explainYour')}
            </Typography>
            <TextArea
              placeholder={t('common.provideDetailsReportMessage')}
              value={descriptionValue}
              onChangeText={onChangeTextHandle}
              placeholderTextColor={colorPalette.grey400}
              withoutBorder
            />
          </Flex>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textPadding: { padding: 4 },
});

export default memo(ReportChatMessage);
