import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import ChannelCategory from '../components/ChannelCategory';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import ScreenHeader from '~/components/ScreenHeader';

import { baseScreenLayout, commonStyles } from '~/styles';
import { channelsValidationSchema } from './validation';
import { channelsCategories } from './constants';
import type { ChannelsForm } from './types';
import { styles } from './styles';

const Channels = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const form = useForm<ChannelsForm>({
    defaultValues: {
      channels: [],
    },
    resolver: zodResolver(channelsValidationSchema),
  });

  const channels = form.watch('channels');

  const handleSelect = (id: string) => {
    const isSelectedChannel = channels.includes(id);

    form.setValue('channels', isSelectedChannel ? channels.filter((c) => c !== id) : [...channels, id], {
      shouldValidate: true,
    });
  };

  const handleContinue = () => navigate('Creators');

  const handleSkip = () => {
    console.log('handle skip');
    navigate('Creators');
  };

  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <ScrollView
          contentContainerStyle={[baseScreenLayout.scrollContent, commonStyles.baseScreenPadding]}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title={t('channels.title')} subTitle={t('channels.subtitle')} />
          <Flex style={styles.wrapper}>
            {channelsCategories.map((category) => {
              return <ChannelCategory key={category.id} selectedIds={channels} onSelect={handleSelect} {...category} />;
            })}
          </Flex>
        </ScrollView>
        <Flex gap={24} style={commonStyles.baseFooter}>
          <Button
            text={`${channels.length}/3 ${t('common.continue')}`}
            size='lg'
            disabled={!form.formState.isValid}
            onPress={handleContinue}
          />
          <Button type='text' size='md' text={t('common.skip')} onPress={handleSkip} />
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

export default Channels;
