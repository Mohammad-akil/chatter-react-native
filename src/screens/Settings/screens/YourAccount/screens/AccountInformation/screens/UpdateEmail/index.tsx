import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import { ControlledTextInput, TextInput } from '~/ui/TextInput';
import { normalize } from '~/utils/normalize';
import { changeEmailValidationSchema } from './validation';

const UpdateEmail = () => {
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const { goBack } = useNavigation();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(changeEmailValidationSchema),
  });
  const { isDirty } = form.formState;
  const newEmail = form.watch('email');

  const updateEmail = useCallback(() => {
    if (newEmail === user?.email) {
      form.setError('email', { message: 'This is your current email' });
    } else {
      form.clearErrors('email');
      goBack();
    }
  }, [form, goBack, newEmail, user?.email]);

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.updateEmail')} />
        <Flex flex={1} justifyContent='space-between'>
          <Flex gap={32} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
            <TextInput editable={false} label={t('common.current')} placeholder={user?.email} />
            <ControlledTextInput
              name='email'
              label={t('common.new')}
              placeholder={'Email'}
              autoCapitalize='none'
              withBorder
            />
          </Flex>
          <Flex style={commonStyles.baseFooter} gap={22}>
            <Button
              text={t('common.update')}
              type='primary'
              disabled={!isDirty}
              onPress={form.handleSubmit(updateEmail)}
            />
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
export default memo(UpdateEmail);
