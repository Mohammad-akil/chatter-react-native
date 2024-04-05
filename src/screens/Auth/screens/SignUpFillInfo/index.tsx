import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { baseScreenLayout, commonStyles } from '~/styles';
import { RootStackParamList } from '~/navigation';

import ScreenHeader from '~/components/ScreenHeader';
import { ControlledTextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';

import { signUpFillInfoValidationSchema } from './validation';
import type { SignUpFillInfoForm } from './types';
import { styles } from './styles';
import { normalize } from '~/utils/normalize';
import { useSetRecoilState } from 'recoil';
import { singUpProcessData } from '../../state';
import { useDebounce } from '~/hooks/useDebounce';
import { api } from '~/api';

const animation = LinearTransition.duration(300);

const SignUpFillInfo = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'SignUpFillInfo'>>();

  const form = useForm({
    defaultValues: {
      email: params?.email || '',
      username: '',
      first_name: '',
      last_name: '',
      password: '',
    },
    resolver: zodResolver(signUpFillInfoValidationSchema),
  });

  const username = form.watch('username');
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkUsername = async () => {
      const response = await api.auth.checkUsernameExists(debouncedUsername);
      if (!response?.available) {
        form.setError('username', { message: 'This username is already in use' });
      } else {
        form.clearErrors('username');
      }
    };
    checkUsername();
  }, [debouncedUsername, form]);

  const setSignUpData = useSetRecoilState(singUpProcessData);
  const handleContinue = async (data: SignUpFillInfoForm) => {
    const response = await api.auth.checkUsernameExists(debouncedUsername);
    if (!response?.available) {
      form.setError('username', { message: 'This username is already in use' });
      return;
    }

    setSignUpData({
      email: data.email,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
    });
    navigate('VerifyAccount');
  };
  const handleLogin = () => navigate('Login');

  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <KeyboardAvoidingView
          behavior='padding'
          style={commonStyles.flexFull}
          keyboardVerticalOffset={normalize(Platform.OS === 'ios' ? 0 : -250)}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
            <ScreenHeader title={t('common.signup')} />
            <Flex style={styles.formContainer} gap={24}>
              <Animated.View layout={animation}>
                <ControlledTextInput
                  name='email'
                  keyboardType='email-address'
                  label={t('common.emailAddress')}
                  placeholder='tyler@chatter.com'
                  withBorder
                  containerStyle={commonStyles.flexFull}
                  textContentType='emailAddress'
                  autoCapitalize='none'
                />
              </Animated.View>
              <Animated.View layout={animation}>
                <ControlledTextInput
                  name='username'
                  label={t('common.username')}
                  placeholder={t('common.yourUsername')}
                  withBorder
                  autoCapitalize='none'
                />
              </Animated.View>
              <AnimatedFlex
                layout={animation}
                gap={24}
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <ControlledTextInput
                  name='first_name'
                  label={t('common.firstName')}
                  placeholder={t('common.yourFirstName')}
                  containerStyle={commonStyles.flexFull}
                  withBorder
                  autoCapitalize='none'
                />
                <ControlledTextInput
                  name='last_name'
                  textContentType='oneTimeCode' // BECAUSE OF BUG WITH KEYOBARD ON IOS 17+
                  label={t('common.lastName')}
                  placeholder={t('common.yourLastName')}
                  containerStyle={commonStyles.flexFull}
                  withBorder
                  autoCapitalize='none'
                />
              </AnimatedFlex>
              <Animated.View layout={animation}>
                <ControlledTextInput
                  name='password'
                  label={t('common.password')}
                  placeholder={t('common.setPassword')}
                  secureTextEntry
                  textContentType='oneTimeCode' // BECAUSE OF BUG WITH KEYOBARD ON IOS 17+
                  withBorder
                  autoCapitalize='none'
                />
              </Animated.View>
            </Flex>
          </ScrollView>
          <Flex gap={24} style={commonStyles.baseFooter}>
            <Button size='lg' onPress={form.handleSubmit(handleContinue)} text={t('common.continue')} />
            <Flex flexDirection='row' alignItems='center' justifyContent='center'>
              <Typography type='label' size='small'>
                {t('common.alreadyHaveAnAccount')}
              </Typography>
              <Button type='link' size='sm' onPress={handleLogin} text={t('common.login')} />
            </Flex>
          </Flex>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FormProvider>
  );
};

export default SignUpFillInfo;
