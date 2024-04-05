import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import { z } from 'zod';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import { ControlledTextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { updatePasswordValidationSchema } from './validation';
import { useStorageUser } from '~/services/mmkv/auth';

type FormData = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangeYourPassword = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();

  const form = useForm<FormData>({
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(updatePasswordValidationSchema),
  });

  const updatePassword = useCallback(() => {}, []);

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader
          style={commonStyles.baseScreenPadding}
          withBackButton={true}
          title={t('settings.changeYourPassword')}
        />
        <Flex flex={1} justifyContent='space-between'>
          <Flex gap={32} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
            <Flex gap={8}>
              <ControlledTextInput
                name='password'
                label={t('common.currentPassword')}
                secureTextEntry
                textContentType='password'
                withBorder
                autoCapitalize='none'
              />
              <Typography size='semibold' color='primary500' onPress={() => {}}>
                {t('common.forgotPassword')}
              </Typography>
            </Flex>

            <ControlledTextInput
              name='newPassword'
              label={t('settings.newPassword')}
              secureTextEntry
              textContentType='password'
              withBorder
              autoCapitalize='none'
            />
            <ControlledTextInput
              name='confirmPassword'
              label={t('settings.confirmNewPassword')}
              secureTextEntry
              textContentType='password'
              withBorder
              autoCapitalize='none'
            />
          </Flex>
          <Flex style={commonStyles.baseFooter} gap={22}>
            <Button text={t('common.update')} type='primary' onPress={form.handleSubmit(updatePassword)} />
            <Button text={t('common.cancel')} type='text' onPress={goBack} />
          </Flex>
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
});
export default memo(ChangeYourPassword);
