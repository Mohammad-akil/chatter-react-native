import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { RequestedUser } from '~/components/ChannelUsersList/ChannelUserListItem/types';
import ScreenHeader from '~/components/ScreenHeader';
import ChannelUsersList from '~/components/ChannelUsersList';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { users } from '~/constants/users';

const ChannelLeaders = () => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const form = useForm<{ leaders: RequestedUser[] }>({
    defaultValues: {
      leaders: [{ id: '1', status: 'existing' }],
    },
  });

  return (
    <FormProvider {...form}>
      <SafeAreaView style={[commonStyles.baseSafeArea, commonStyles.baseScreen]}>
        <ScreenHeader
          titleSize='medium'
          withBackButton
          style={commonStyles.baseScreenPadding}
          title={t('editChannel.leadersHeaderTitle')}
        >
          <IconButton iconName='checkmark' type='primary' onPress={goBack} />
        </ScreenHeader>
        <Flex style={commonStyles.baseScreenPadding} gap={12}>
          <Typography type='headline' size='medium'>
            {t('editChannel.leadersTitle')}
          </Typography>
          <Typography type='body' size='default'>
            {t('editChannel.leadersDescription')}
          </Typography>
        </Flex>
        <ChannelUsersList style={commonStyles.baseScreenPadding} type='leader' name='leaders' users={users} />
      </SafeAreaView>
    </FormProvider>
  );
};

export default ChannelLeaders;
