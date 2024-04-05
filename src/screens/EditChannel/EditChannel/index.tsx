import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { commonStyles } from '~/styles';

import ScreenHeader from '~/components/ScreenHeader';
import { ControlledTextInput, TextInput } from '~/ui/TextInput';
import { ControlledTextArea } from '~/ui/TextArea';
import EditableUsersList from '../components/EditableUsersList';
import AudioDescription from '../components/AudioDescription';
import { normalize } from '~/utils/normalize';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';
import EditChannelModal from '../components/EditChannelModal';
import { useRecoilState } from 'recoil';
import { channelState } from '~/screens/Channel/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { editChannelSchema } from './validation';
import { storage } from '~/services/mmkv';
import { getChannel } from '~/screens/Channel/utils/getChannel';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';
import { api } from '~/api';
import { useMutation } from '@tanstack/react-query';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';

const EditChannel = () => {
  const { t } = useTranslation();
  const user = storage.auth.getUser();
  const channelOwner = `${user?.first_name} ${user?.last_name} @${user?.username}`;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSetFromModal, setFromModal] = useState(false);
  const [channel, setChannel] = useRecoilState(channelState);
  const [audioStatus, setAudioStatus] = useState<RecordingStatus>('recording');
  const [audioDescription, setAudioDescription] = useState<AudioTypes>();
  const form = useForm({
    defaultValues: channel,
    mode: 'onChange',
    resolver: zodResolver(editChannelSchema),
    reValidateMode: 'onChange',
  });

  const { mutate, data, isSuccess } = useMutation({
    mutationFn: (params: { channelId: string; formData: FormData }) => {
      const { channelId, formData } = params;
      return api.channel.uploadAudioDescription(channelId, formData);
    },
  });

  const { isDirty } = form.formState;
  const { navigate } = useNavigation();
  const handleEditAdmins = useCallback(() => navigate('ChannelAdmins'), [navigate]);
  const handleEditLeaders = useCallback(() => navigate('ChannelLeaders'), [navigate]);

  const { name, leaders, admins, description } = form.watch();
  const { handleSubmit } = form;

  const handleSave = useCallback(async () => {
    await handleSubmit(async () => {
      try {
        await api.channel.editChannel(channel.id, name, description);
        await api.auth.me();
        getChannel(channel.id, setChannel);
        navigate('Main', { screen: 'Channel' });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Something is wrong. Try again',
        } as CustomToastProps);
      }
    })();
  }, [channel?.id, description, handleSubmit, name, navigate, setChannel]);

  useEffect(() => {
    if (isSetFromModal) {
      handleSave();
    }
    setFromModal(false);
  }, [description, handleSave, isSetFromModal, name, navigate]);

  const goBackHandle = useCallback(() => {
    if (isDirty) {
      setModalVisible(true);
    } else {
      navigate('Main', { screen: 'Channel' });
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
          title={t('editChannel.headerTitle')}
        >
          <IconButton iconName='checkmark' type='primary' disabled={!isDirty} onPress={handleSave} />
        </ScreenHeader>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[commonStyles.baseScrollView, styles.wrapper]}
        >
          <ControlledTextInput
            editable
            name='name'
            placeholder={t('editChannel.enterChannelName')}
            label={t('editChannel.channelName')}
            withBorder
          />
          <Flex flexDirection='row' justifyContent='space-between'>
            <TextInput
              editable={false}
              value={channelOwner}
              containerStyle={styles.ownerContainer}
              placeholder={t('editChannel.enterChannelOwner')}
              label={t('editChannel.channelOwner')}
            />
          </Flex>

          <EditableUsersList
            title={t('common.admins')}
            onEdit={handleEditAdmins}
            users={[
              {
                id: '1',
                avatar:
                  'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
              },
            ]}
          />
          <EditableUsersList
            title={t('common.leaders')}
            onEdit={handleEditLeaders}
            users={[
              {
                id: '1',
                avatar:
                  'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
              },
            ]}
          />
          <ControlledTextArea
            name='description'
            label={t('common.description')}
            placeholder={t('common.addDescription')}
            defaultHeight={normalize(128)}
          />
          {/* <AudioDescription status={audioStatus} setStatus={setAudioStatus} /> */}
        </ScrollView>
      </SafeAreaView>
      {modalVisible && (
        <EditChannelModal isVisible={modalVisible} setIsVisible={setModalVisible} setFromModal={setFromModal} />
      )}
    </FormProvider>
  );
};

export default EditChannel;

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
