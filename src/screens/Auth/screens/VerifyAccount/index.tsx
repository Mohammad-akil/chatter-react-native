import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { type CountryCode } from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { getCountry } from 'react-native-localize';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import ScreenHeader from '~/components/ScreenHeader';
import Flex from '~/ui/Flex';
import Button from '~/ui/Button';

import OtpInput from '../../components/OtpInput';
import ResendCodeButton from '../../components/ResendCodeButton';
import PhoneNumberInput from '../../components/PhoneNumberInput';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';
import { type PhoneNumberSchema, phoneNumberSchema } from './validation';
import Toast from 'react-native-toast-message';
import { useRecoilState } from 'recoil';

import { CustomShowParams } from '~/ui/Toast/types';

import { api } from '~/api';
import { signUpProcessIntent, signUpProcessProvider, singUpProcessData } from '../../state';
import Animated, { LinearTransition } from 'react-native-reanimated';

const userCountry = getCountry() as CountryCode;
const DEFAULT_COUNTRY_CODE: CountryCode = userCountry || 'US';

const VerifyAccount = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
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

  const [validPhone, setValidPhone] = useState<string | null>(null);
  const [intent] = useRecoilState(signUpProcessIntent);
  const [signUpData] = useRecoilState(singUpProcessData);
  const [providerData] = useRecoilState(signUpProcessProvider);

  const handleContinue = useCallback(
    async (code: string) => {
      const checkCodeResponse = await api.auth.validateOTP({
        intent_id: intent.id!,
        intent_hash: intent.hash!,
        code: Number(code),
      });

      if (!checkCodeResponse?.valid) {
        Toast.show({
          type: 'error',
          text1: checkCodeResponse?.error,
        } as CustomShowParams);
        return;
      }

      const registerResponse = await api.auth.registerComplete({
        provider: providerData.provider,
        email: signUpData.email,
        provider_payload: providerData.provider_payload,
        username: signUpData.username,
        first_name: signUpData.first_name,
        last_name: signUpData.last_name,
        password: signUpData.password,
        phone_number: validPhone!,
        intent_id: intent.id!,
      });

      console.log(registerResponse);

      if (registerResponse?.error) {
        Toast.show({
          type: 'error',
          text1: registerResponse?.error,
        } as CustomShowParams);
        return;
      }

      navigate('Interests', { name: signUpData.first_name });
    },
    [navigate, intent, signUpData, validPhone, providerData],
  );

  const handleSend = useCallback(
    async (data: PhoneNumberSchema) => {
      const phoneNumber = '+' + data.countryCallCode + data.phoneNumber;

      if (!intent.id || !intent.hash) {
        navigate('SignUp');
        return;
      }

      const updateIntentResp = await api.auth.updateIntent({
        intent_id: intent.id,
        intent_hash: intent.hash,
        phone_number: phoneNumber,
      });

      if (updateIntentResp?.error) {
        Toast.show({
          type: 'error',
          text1: updateIntentResp.message,
        } as CustomShowParams);
        return;
      }

      const otpResponse = await api.auth.requestOTP({ intent_id: intent.id, intent_hash: intent.hash });
      if (!otpResponse?.success) {
        Toast.show({
          type: 'error',
          text1: otpResponse?.message,
        } as CustomShowParams);
        return;
      }

      setValidPhone(phoneNumber);
    },
    [intent, navigate],
  );

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScrollView
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          style={commonStyles.baseScrollView}
        >
          <ScreenHeader title={t('common.verifyAccount')} subTitle={t('verifyAccount.subtitle')} />
          <Flex style={styles.formContainer} gap={24}>
            <PhoneNumberInput />
            <Animated.View layout={LinearTransition.duration(300)}>
              {validPhone && <OtpInput label={t('common.enterCode')} autoFocusOnLoad onFill={handleContinue} />}
              {validPhone ? (
                <ResendCodeButton onResend={form.handleSubmit(handleSend)} seconds={30} />
              ) : (
                <Button text='Send code' onPress={form.handleSubmit(handleSend)} />
              )}
            </Animated.View>
          </Flex>
        </ScrollView>
      </SafeAreaView>
    </FormProvider>
  );
};

export default VerifyAccount;

const styles = StyleSheet.create({
  formContainer: {
    paddingTop: normalize(40),
  },
});
