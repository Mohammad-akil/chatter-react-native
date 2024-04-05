import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { ControlledSearchInput } from '~/components/SearchInput';
import ScreenHeader from '~/components/ScreenHeader';
import Interest from '~/components/Interest';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { baseScreenLayout, commonStyles } from '~/styles';
import { availableInterests } from './constants';
import { interestsFormValidation } from './validation';
import type { InterestsForm } from './types';
import { styles } from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation';

const Interests = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Interests'>) => {
  const { t } = useTranslation();
  // const { name = 'NAaame' } = route.params!;
  const form = useForm<InterestsForm>({
    defaultValues: { search: '', interests: [] },
    resolver: zodResolver(interestsFormValidation),
  });

  useFocusEffect(
    useCallback(() => {
      const preventGoingBack = (e: any) => {
        e.preventDefault();
      };

      navigation.addListener('beforeRemove', preventGoingBack);
      return () => {
        navigation.removeListener('beforeRemove', preventGoingBack);
      };
    }, [navigation]),
  );

  const [search, interests] = form.watch(['search', 'interests']);
  const filteredInterests = useMemo(() => {
    if (search) {
      return availableInterests.filter(({ text }) => text.toLowerCase().includes(search.toLowerCase()));
    }

    return availableInterests;
  }, [search]);
  const handleSelect = (id: string) => {
    const isExistingInterest = interests.includes(id);

    form.setValue('interests', isExistingInterest ? interests.filter((i) => i !== id) : [...interests, id], {
      shouldValidate: true,
    });
  };
  const handleSkip = () => navigation.navigate('Channels');
  const handleContinue = () => navigation.navigate('Channels');

  return (
    <FormProvider {...form}>
      <SafeAreaView style={baseScreenLayout.baseSafeArea}>
        <ScrollView
          style={baseScreenLayout.scrollComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[baseScreenLayout.scrollContent, commonStyles.baseScreenPadding]}
        >
          <ScreenHeader title={t('interestsScreen.title', { name: 'asdasd' })} />
          <ControlledSearchInput style={styles.searchInputContainer} name='search' />
          <Flex flexDirection='row' flexWrap='wrap' style={styles.interests}>
            {filteredInterests.map((item) => {
              return (
                <Interest {...item} key={item.id} isSelected={interests.includes(item.id)} onClick={handleSelect} />
              );
            })}
          </Flex>
        </ScrollView>
        <Flex gap={24} style={commonStyles.baseFooter}>
          <Button
            size='lg'
            text={`${interests.length}/3 ${t('common.continue')}`}
            disabled={!form.formState.isValid}
            onPress={handleContinue}
          />
          <Button type='text' size='md' text={t('common.skip')} onPress={handleSkip} />
        </Flex>
      </SafeAreaView>
    </FormProvider>
  );
};

export default Interests;
