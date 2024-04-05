import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { memo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Switch } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import PhoneNumberInput from '~/screens/Auth/components/PhoneNumberInput';
import { getCountry } from 'react-native-localize';
import { CountryCode } from 'react-native-country-picker-modal';
import { PhoneNumberSchema, phoneNumberSchema } from '~/screens/Auth/screens/VerifyAccount/validation';
import Typography from '~/ui/Typography';
import { colorPalette } from '~/styles/colors';

const UpdatePhone = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  //   const [validPhone, setValidPhone] = useState();
  const [isLearMoreEnabled, setIsLearMoreEnabled] = useState(false);
  const [isPrivacyPolicyEnabled, setIsPrivacyPolicyEnabled] = useState(false);
  const toggleSwitchPrivacyPolicy = () => setIsPrivacyPolicyEnabled((previousState) => !previousState);
  const toggleSwitchLearMore = () => setIsLearMoreEnabled((previousState) => !previousState);

  const userCountry = getCountry() as CountryCode;
  const DEFAULT_COUNTRY_CODE: CountryCode = userCountry || 'US';

  const form = useForm<PhoneNumberSchema>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      countryCode: DEFAULT_COUNTRY_CODE,
      countryCallCode: '',
      phoneNumber: '', // US test 2312322334
    },
    resolver: zodResolver(phoneNumberSchema),
  });
  const { isDirty } = form.formState;

  const handleSend = () => {};
  const handleContinue = () => {};

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.updatePhone')} />
        <ScrollView>
          <Flex gap={24} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
            <Flex style={styles.formContainer}>
              <PhoneNumberInput />
            </Flex>
            <Flex gap={7}>
              <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
                <Typography type='body' size='default' style={styles.conditions}>
                  {t('settings.letThePeople')}
                </Typography>
                <Switch
                  trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
                  onValueChange={toggleSwitchLearMore}
                  value={isLearMoreEnabled}
                />
              </Flex>
              <Flex justifyContent='flex-start' style={styles.linkButton}>
                <Typography size='semibold' onPress={() => {}} color='primary500'>
                  {t('settings.learnMore')}
                </Typography>
              </Flex>
            </Flex>
            <Flex gap={7}>
              <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
                <Typography type='body' size='default' style={styles.conditions}>
                  {t('settings.letChatterUse')}
                </Typography>
                <Switch
                  trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
                  onValueChange={toggleSwitchPrivacyPolicy}
                  value={isPrivacyPolicyEnabled}
                />
              </Flex>
              <Flex justifyContent='flex-start' style={styles.linkButton}>
                <Typography size='semibold' onPress={() => {}} color='primary500'>
                  {t('settings.seeOurPrivacy')}
                </Typography>
              </Flex>
            </Flex>
          </Flex>
        </ScrollView>
        <Flex style={commonStyles.baseFooter} gap={22}>
          <Button
            text={t('common.continue')}
            type='primary'
            disabled={!isDirty}
            onPress={form.handleSubmit(() => {})}
          />
          <Button text={t('common.cancel')} type='text' onPress={goBack} />
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: normalize(16),
    gap: normalize(32),
  },
  formContainer: {
    paddingTop: normalize(40),
  },
  conditions: { maxWidth: '80%' },
  linkButton: { paddingVertical: 8 },
});
export default memo(UpdatePhone);
