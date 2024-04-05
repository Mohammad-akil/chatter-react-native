import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { useDebounce } from '~/hooks/useDebounce';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import { ControlledTextInput, TextInput } from '~/ui/TextInput';
import { normalize } from '~/utils/normalize';
import { changeUsernameValidationSchema } from './validation';
import { api } from '~/api';
import { useMutation } from '@tanstack/react-query';

const UpdateUsername = () => {
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const { goBack } = useNavigation();

  const form = useForm({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(changeUsernameValidationSchema),
  });
  const { isDirty } = form.formState;
  const username = form.watch('username');
  const debouncedUsername = useDebounce(username, 500);

  const { data, mutate } = useMutation({
    mutationFn: (newUsername: string) => api.auth.checkUsernameExists(newUsername),
  });

  useEffect(() => {
    mutate(debouncedUsername);
  }, [debouncedUsername, mutate]);

  useEffect(() => {
    const checkUsername = () => {
      if (!data?.available && data) {
        form.setError('username', { message: 'This username is already in use' });
      } else {
        form.clearErrors('username');
      }
    };
    checkUsername();
  }, [data, debouncedUsername, form]);

  const updateUsername = useCallback(async () => {
    const response = await api.auth.checkUsernameExists(debouncedUsername);
    if (!response?.available) {
      form.setError('username', { message: 'This username is already in use' });
      return;
    }
    goBack();
  }, [debouncedUsername, form, goBack]);

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader
          style={commonStyles.baseScreenPadding}
          withBackButton={true}
          title={t('settings.updateUsername')}
        />
        <Flex flex={1} justifyContent='space-between'>
          <Flex gap={32} style={[styles.scrollContent, commonStyles.baseScreenPadding]}>
            <TextInput editable={false} label={t('common.current')} placeholder={user?.username} />
            <ControlledTextInput
              name='username'
              label={t('common.new')}
              placeholder={'Username'}
              autoCapitalize='none'
              withBorder
            />
          </Flex>
          <Flex style={commonStyles.baseFooter} gap={22}>
            <Button
              text={t('common.update')}
              type='primary'
              disabled={!isDirty}
              onPress={form.handleSubmit(updateUsername)}
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
export default memo(UpdateUsername);
