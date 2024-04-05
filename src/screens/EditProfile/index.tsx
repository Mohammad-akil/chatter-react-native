import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { commonStyles } from '~/styles';
import ScreenHeader from '~/components/ScreenHeader';
import { ControlledTextInput } from '~/ui/TextInput';
import { ControlledTextArea } from '~/ui/TextArea';
import { normalize } from '~/utils/normalize';
import IconButton from '~/ui/IconButton';
import { zodResolver } from '@hookform/resolvers/zod';
import EditChannelModal from '~/screens/EditChannel/components/EditChannelModal';
import { editProfileSchema } from './validation';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';
import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';
import { useQueryClient } from '@tanstack/react-query';
import AudioDescription from '../EditChannel/components/AudioDescription';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';

const EditProfile = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isSetFromModal, setFromModal] = useState(false);
  const [user] = useStorageUser();
  const [audioDescription, setAudioDescription] = useState<AudioTypes>();
  const [status, setStatus] = useState<RecordingStatus>('unrecorded');
  const form = useForm({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      profile_description: user?.profile_description,
    },
    mode: 'onChange',
    resolver: zodResolver(editProfileSchema),
    reValidateMode: 'onChange',
  });

  console.log(audioDescription);

  const { isDirty } = form.formState;
  const { navigate } = useNavigation();
  const { first_name, last_name, profile_description } = form.watch();
  const { handleSubmit } = form;
  const handleSave = useCallback(async () => {
    await handleSubmit(async () => {
      try {
        await api.profile.editProfile({ first_name, last_name, profile_description });
        if (audioDescription?.audio) {
          const formData = new FormData();
          formData.append('file', audioDescription);
        }
        queryClient.invalidateQueries({ queryKey: ['me'] });
        navigate('Main', { screen: 'Profile' });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Something is wrong. Try again',
        } as CustomToastProps);
      }
    })();
  }, [first_name, queryClient, handleSubmit, last_name, navigate, profile_description]);

  useEffect(() => {
    if (isSetFromModal) {
      handleSave();
    }
    setFromModal(false);
  }, [handleSave, isSetFromModal, navigate]);

  const goBackHandle = useCallback(() => {
    if (isDirty) {
      setModalVisible(true);
    } else {
      navigate('Main', { screen: 'Profile' });
    }
  }, [isDirty, navigate]);

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader
          withBackButton
          onBack={goBackHandle}
          titleSize='medium'
          style={commonStyles.baseScreenPadding}
          title={t('editProfile.title')}
        >
          <IconButton iconName='checkmark' type='primary' disabled={!isDirty} onPress={handleSave} />
        </ScreenHeader>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[commonStyles.baseScrollView, styles.wrapper]}
        >
          <ControlledTextInput
            editable
            name='first_name'
            placeholder={t('editProfile.enterProfileFirstName')}
            label={t('editProfile.profileFirstName')}
            withBorder
          />
          <ControlledTextInput
            editable
            name='last_name'
            placeholder={t('editProfile.enterProfileLastName')}
            label={t('editProfile.profileLastName')}
            withBorder
          />
          <ControlledTextArea
            name='profile_description'
            label={t('common.description')}
            placeholder={t('common.addDescription')}
            defaultHeight={128}
          />
          <AudioDescription status={status} setAudioDescription={setAudioDescription} setStatus={setStatus} />
        </ScrollView>
      </SafeAreaView>
      {modalVisible && (
        <EditChannelModal isVisible={modalVisible} setIsVisible={setModalVisible} setFromModal={setFromModal} />
      )}
    </FormProvider>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  wrapper: {
    gap: normalize(40),
    paddingBottom: normalize(80),
    paddingTop: normalize(20),
  },
  ownerContainer: {
    width: '50%',
  },
});
