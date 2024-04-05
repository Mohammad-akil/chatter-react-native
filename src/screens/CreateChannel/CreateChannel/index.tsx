import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { commonStyles } from '~/styles';
import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';

import DetailsStep from '../steps/Details';
import AdminsStep from '../steps/Admins';
import LeadersStep from '../steps/Leaders';

import { validationSchema } from '../validation';
import type { CreateChannelForm } from './types';
import { createChannelStyles as styles } from './styles';

import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import { channelId, channelWasCreated } from '~/screens/Channel/state';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';

const screens = [
  { key: 'details', title: '' },
  { key: 'admins', title: '' },
  { key: 'leaders', title: '' },
];

const CreateChannel = () => {
  const setCreateChannel = useSetRecoilState(channelWasCreated);
  const setSelectedChannelId = useSetRecoilState(channelId);
  const window = useWindowDimensions();
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const [screenIndex, setScreenIndex] = useState(0);

  const resolver = useMemo(() => {
    const currentScreenKey = screens[screenIndex]?.key;

    switch (currentScreenKey) {
      case 'details': {
        return zodResolver(validationSchema.pick({ name: true }));
      }
      case 'admins': {
        return zodResolver(validationSchema.pick({ admins: true }));
      }
      case 'leaders': {
        return zodResolver(validationSchema.pick({ leaders: true }));
      }
    }
  }, [screenIndex]);

  const form = useForm<CreateChannelForm>({
    defaultValues: {
      name: '',
      description: '',
      admins: [],
      leaders: [],
    },
    resolver,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resetOptions: {
      keepIsSubmitSuccessful: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    },
  });
  const { handleSubmit, clearErrors, reset, formState } = form;

  const { name, description, admins, leaders } = form.watch();

  const handleBack = useCallback(() => {
    if (screenIndex === 0) {
      return goBack();
    }

    setScreenIndex(screenIndex - 1);
  }, [screenIndex, goBack]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNext = useCallback(
    handleSubmit(async () => {
      if (screenIndex === screens.length - 1) {
        try {
          const channelName = name;
          const channelDescription = description;
          const res = await api.channel.createChannel(channelName.trim(), channelDescription.trim());
          setSelectedChannelId(res.channel.id);
          setScreenIndex(0);
          setCreateChannel(true);
          return navigate('Main', { screen: 'Channel' });
        } catch {
          Toast.show({
            type: 'error',
            text1: 'Something is wrong. Try again',
          } as CustomToastProps);
        }
      }
      setScreenIndex(screenIndex + 1);
    }),
    [handleSubmit, screenIndex, navigate],
  );
  useFocusEffect(
    useCallback(() => {
      reset();
    }, [reset]),
  );
  const renderScene = useMemo(
    () =>
      SceneMap({
        details: () => <DetailsStep />,
        admins: () => <AdminsStep />,
        leaders: () => <LeadersStep />,
      }),
    [],
  );

  useEffect(() => {
    clearErrors();
  }, [screenIndex, clearErrors]);

  return (
    <FormProvider {...form}>
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader
          withBackButton
          onBack={handleBack}
          style={commonStyles.baseScreenPadding}
          title={t('createChannel.title')}
        >
          <IconButton type='primary' disabled={!formState.isValid} iconName='checkmark' onPress={handleNext} />
        </ScreenHeader>
        <TabView
          swipeEnabled={false}
          sceneContainerStyle={styles.scene}
          navigationState={{ index: screenIndex, routes: screens }}
          renderScene={renderScene}
          onIndexChange={setScreenIndex}
          initialLayout={{ width: window.width }}
          renderTabBar={() => null}
        />
      </SafeAreaView>
    </FormProvider>
  );
};

export default CreateChannel;
