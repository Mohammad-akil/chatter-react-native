import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import { availableInterests } from '~/screens/UserOnboarding/Interests/constants';
import Interest from '~/components/Interest';
import { useForm } from 'react-hook-form';
import { interestsFormValidation } from '~/screens/UserOnboarding/Interests/validation';
import { zodResolver } from '@hookform/resolvers/zod';

export type InterestsForm = {
  interests: string[];
};

const Content = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const form = useForm<InterestsForm>({
    defaultValues: { interests: [] },
    resolver: zodResolver(interestsFormValidation),
  });

  const [interests] = form.watch(['interests']);

  const handleSelectInterests = (id: string) => {
    const isExistingInterest = interests.includes(id);

    form.setValue('interests', isExistingInterest ? interests.filter((i) => i !== id) : [...interests, id], {
      shouldValidate: true,
    });
  };
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.content')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex gap={4}>
            <Typography type='label' size='large'>
              {t('common.interests')}
            </Typography>
            <Typography style={styles.subtitle} size='default'>
              {t('settings.manageTheTypeOfContent')}
            </Typography>
          </Flex>
          <Flex gap={16}>
            <Typography type='label' size='large'>
              {t('common.following')}
            </Typography>
            <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Typography type='label' size='large'>
                Real Estate
              </Typography>
              <Button type='ghost' size='sm' text={t('common.following')} />
            </Flex>
            <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Typography type='label' size='large'>
                Fashion
              </Typography>
              <Button type='ghost' size='sm' text={t('common.following')} />
            </Flex>
            <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Typography type='label' size='large'>
                Film
              </Typography>
              <Button type='ghost' size='sm' text={t('common.following')} />
            </Flex>
          </Flex>
          <Flex gap={24}>
            <Typography type='label' size='large'>
              {t('common.topics')}
            </Typography>
            <Flex gap={10}>
              <Typography type='label' size='medium' color='grey300'>
                All topics A-Z
              </Typography>
              <Flex flexDirection='row' flexWrap='wrap' style={styles.interests}>
                {availableInterests.map((item) => {
                  return (
                    <Interest
                      {...item}
                      key={item.id}
                      isSelected={interests.includes(item.id)}
                      onClick={handleSelectInterests}
                    />
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
    paddingBottom: normalize(80),
  },
  buttonLink: {
    paddingVertical: 8,
  },
  subtitle: {
    maxWidth: '80%',
  },
  interests: {
    gap: 6,
  },
});
export default memo(Content);
