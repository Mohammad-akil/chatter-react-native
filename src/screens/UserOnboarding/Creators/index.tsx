import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import CreatorCategory from '../components/CreatorCategory';
import Button from '~/ui/Button';
import { baseScreenLayout, commonStyles } from '~/styles';

import { creatorsValidationSchema } from './validation';
import { creatorsCategories } from './constants';
import { styles } from './styles';
import type { CreatorsForm } from './types';
import Flex from '~/ui/Flex';
import ScreenHeader from '~/components/ScreenHeader';

const Creators = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const form = useForm<CreatorsForm>({
    defaultValues: {
      creators: [],
    },
    resolver: zodResolver(creatorsValidationSchema),
  });

  const creators = form.watch('creators');

  const handleSelect = (id: string) => {
    const isSelectedChannel = creators.includes(id);

    form.setValue('creators', isSelectedChannel ? creators.filter((c) => c !== id) : [...creators, id], {
      shouldValidate: true,
    });
  };
  const handleContinue = () => navigate('Welcome');
  const handleSkip = () => navigate('Welcome');

  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <ScrollView
          style={baseScreenLayout.scrollComponent}
          contentContainerStyle={[baseScreenLayout.scrollContent, commonStyles.baseScreenPadding]}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title={t('creators.title')} subTitle={t('creators.subtitle')} />
          <Flex style={styles.categories}>
            {creatorsCategories.map((category) => (
              <CreatorCategory {...category} onSelect={handleSelect} selectedIds={creators} key={category.id} />
            ))}
          </Flex>
        </ScrollView>
        <Flex gap={24} style={commonStyles.baseFooter}>
          <Button
            text={`${creators.length}/3 ${t('common.continue')}`}
            disabled={!form.formState.isValid}
            size='lg'
            onPress={form.handleSubmit(handleContinue)}
          />
          <Button type='text' size='md' text={t('common.skip')} onPress={handleSkip} />
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

export default Creators;
