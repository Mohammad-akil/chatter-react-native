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

import { users } from '~/constants/users';
import { commonStyles } from '~/styles';

const ChannelAdmins = () => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const form = useForm<{ admins: RequestedUser[] }>({
    defaultValues: {
      admins: [{ id: '1', status: 'existing' }],
    },
  });

  return (
    <FormProvider {...form}>
      <SafeAreaView style={[commonStyles.baseSafeArea, commonStyles.baseScreen]}>
        <ScreenHeader
          titleSize='medium'
          withBackButton
          style={commonStyles.baseScreenPadding}
          title={t('editChannel.adminsHeaderTitle')}
        >
          <IconButton iconName='checkmark' type='primary' onPress={goBack} />
        </ScreenHeader>
        <Flex style={commonStyles.baseScreenPadding} gap={12}>
          <Typography type='headline' size='medium'>
            {t('editChannel.adminsTitle')}
          </Typography>
          <Typography type='body' size='default'>
            {t('editChannel.adminsDescription')}
          </Typography>
        </Flex>
        <ChannelUsersList style={commonStyles.baseScreenPadding} type='admin' name='admins' users={users} />
      </SafeAreaView>
    </FormProvider>
  );
};

export default ChannelAdmins;
