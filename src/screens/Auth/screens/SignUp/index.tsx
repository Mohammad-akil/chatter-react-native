import { useCallback } from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useSetRecoilState } from 'recoil';

import { api } from '~/api';

import SocialLoginButtons from '../../components/SocialLoginButtons';
import { ControlledTextInput } from '~/ui/TextInput';
import ChatterIcon from '~/ui/ChatterIcon';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { baseScreenLayout, commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import { signUpProcessIntent, signUpProcessProvider } from '../../state';
import { signUpValidationSchema } from './validation';
import type { SignUpForm } from './types';
import { styles } from './styles';

const SignUp = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const form = useForm<SignUpForm>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(signUpValidationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const setIntent = useSetRecoilState(signUpProcessIntent);
  const setProviderPayload = useSetRecoilState(signUpProcessProvider);

  const goToLogin = useCallback(() => navigate('Login'), [navigate]);
  const handleContinue = useCallback(
    async ({ email }: SignUpForm) => {
      const platform = Platform.OS;

      const intent = await api.auth.getIntent(platform as 'ios' | 'android');
      if (intent) {
        setIntent({ id: intent.id, hash: intent.hash });
        setProviderPayload({
          provider: 'email',
          provider_payload: undefined,
        });

        navigate('SignUpFillInfo', { email, provider: 'email' });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }
    },
    [navigate, setIntent, setProviderPayload],
  );

  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={commonStyles.baseScrollView}>
          <Flex style={styles.logoContainer} alignItems='center' justifyContent='center'>
            <ChatterIcon name='chatter-primary-logo' size={41} color={colorPalette.primary400} />
          </Flex>
          <Typography type='display' size='small'>
            {t('common.signup')}
          </Typography>
          <Flex style={styles.formContainer} gap={18}>
            <ControlledTextInput
              placeholder={t('common.enterEmail')}
              keyboardType='email-address'
              textContentType='emailAddress'
              autoCorrect={false}
              label={t('common.emailAddress')}
              name='email'
              withBorder
              autoCapitalize='none'
            />
            <Button
              size='lg'
              onPress={form.handleSubmit(handleContinue)}
              disabled={!form.formState.isValid}
              text={t('common.continue')}
            />
            <Flex flexWrap='wrap' flexDirection='row'>
              <Typography type='body' size='small'>
                {t('register.descriptionPartOne')}
              </Typography>
              <Button
                type='link'
                size='sm'
                text={t('common.userAgreement')}
                onPress={goToLogin}
                style={commonStyles.zeroPadding}
              />
              <Typography type='body' size='small'>
                {t('register.descriptionPartTwo')}
              </Typography>
              <Button
                type='link'
                size='sm'
                text={t('common.privacyPolicy')}
                onPress={goToLogin}
                style={commonStyles.zeroPadding}
              />
              <Typography type='body' size='small'>
                .
              </Typography>
            </Flex>
            <Flex style={styles.socialLoginContainer} gap={26}>
              <Typography type='label' size='medium'>
                {t('common.orContinueWithSocials')}
              </Typography>
              <SocialLoginButtons />
            </Flex>
          </Flex>
        </ScrollView>
        <Flex style={commonStyles.baseFooter}>
          <Flex flexDirection='row' alignItems='center' justifyContent='center'>
            <Typography type='label' size='small'>
              {t('common.alreadyHaveAnAccount')}
            </Typography>
            <Button type='link' size='sm' onPress={goToLogin} text={t('common.login')} />
          </Flex>
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

export default SignUp;
