import { useNavigation } from '@react-navigation/native';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import SelectInput, { SelectOption } from '~/components/SelectInput';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import { TextArea } from '~/ui/TextArea';
import Typography from '~/ui/Typography';

const ShareFeedback = () => {
  const [selectedOption, setSelectedOption] = useState<SelectOption>();
  const [descriptionValue, setDescriptionValue] = useState<string>();
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();

  const options = [
    { label: t('common.accessibility'), value: 'accessibility' },
    { label: t('common.liveRoom'), value: 'room' },
    { label: t('common.bug'), value: 'bug' },
    { label: t('common.etc'), value: 'etc' },
  ];

  const onChangeTextHandle = useCallback((text: string) => {
    setDescriptionValue(text);
  }, []);

  const sendFeedback = useCallback(() => {
    navigate('ReportMessage', {
      title: t('common.feedbackReceived'),
      message: t('common.thankYouForFeedback'),
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
        <ScreenHeader withBackButton onBack={onBackHandle} backIcon='close-outline' title={t('common.shareFeedback')}>
          <IconButton iconName='send' type='primary' onPress={sendFeedback} />
        </ScreenHeader>
        <Flex gap={40}>
          <SelectInput
            options={options}
            selectKey='feedback'
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            label='Category'
          />
          <Flex gap={12}>
            <Typography type='label' size='medium'>
              {t('common.talkAboutIt')}
            </Typography>
            <TextArea
              placeholder={t('common.provideSomeDetails')}
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

export default memo(ShareFeedback);
