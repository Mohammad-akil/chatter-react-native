import { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '~/api';
import { storage } from '~/services/mmkv';

import SocialLoginButtons from '../../components/SocialLoginButtons';
import { ControlledTextInput } from '~/ui/TextInput';
import ChatterIcon from '~/ui/ChatterIcon';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { baseScreenLayout, commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import { loginValidationSchema } from './validation';
import type { LoginForm } from './types';
import { styles } from './styles';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

const animation = LinearTransition.duration(300);

const Login = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const user = storage.auth.getUser();
  useEffect(() => {
    if (user) {
      navigate('Drawer');
    }
  });
  const form = useForm({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginValidationSchema),
  });

  const goToSignUp = useCallback(() => navigate('SignUpProcess'), [navigate]);

  const handleContinue = async (data: LoginForm) => {
    const { email, password } = data;
    const { error } = await api.auth.login('email', {
      email,
      password,
    });
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.msg;
      Toast.show({
        type: 'error',
        text1: errorMessage,
      } as CustomShowParams);

      console.log(error);
    } else {
      await api.auth.me();
      navigate('Drawer');
    }
  };
  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={commonStyles.baseScrollView}>
          <Flex style={styles.logoContainer} alignItems='center' justifyContent='center'>
            <ChatterIcon name='chatter-primary-logo' size={41} color={colorPalette.primary400} />
          </Flex>
          <Typography type='display' size='small'>
            {t('common.login')}
          </Typography>
          <Flex style={styles.formContainer} gap={16}>
            <Flex gap={32}>
              <Animated.View layout={animation}>
                <ControlledTextInput
                  placeholder={t('common.enterEmail')}
                  keyboardType='email-address'
                  textContentType='oneTimeCode' // BECAUSE OF BUG WITH KEYOBARD ON IOS 17+
                  autoCorrect={false}
                  label={t('common.email')}
                  name='email'
                  withBorder
                  autoCapitalize='none'
                />
              </Animated.View>
              <Animated.View layout={animation}>
                <ControlledTextInput
                  placeholder={t('common.enterPassword')}
                  autoCorrect={false}
                  label={t('common.password')}
                  textContentType='oneTimeCode' // BECAUSE OF BUG WITH KEYOBARD ON IOS 17+
                  secureTextEntry
                  name='password'
                  withBorder
                />
              </Animated.View>
            </Flex>
            <Button size='lg' onPress={form.handleSubmit(handleContinue)} text={t('common.continue')} />
          </Flex>

          <Flex style={styles.socialLoginContainer} gap={26}>
            <Typography type='label' size='medium'>
              {t('common.orContinueWithSocials')}
            </Typography>
            <SocialLoginButtons />
          </Flex>
        </ScrollView>
        <Flex style={commonStyles.baseFooter}>
          <Flex flexDirection='row' alignItems='center' justifyContent='center'>
            <Typography type='label' size='small'>
              {t('common.dontHaveAnAccount')}
            </Typography>
            <Button type='link' size='sm' text={t('common.signup')} onPress={goToSignUp} />
          </Flex>
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

export default Login;
