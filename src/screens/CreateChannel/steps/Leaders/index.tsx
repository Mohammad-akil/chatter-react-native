import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import ChannelUsersList from '~/components/ChannelUsersList';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { users } from '~/constants/users';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

const LeadersStep = () => {
  const { t } = useTranslation();
  return (
    <Flex gap={40} flex={1}>
      <Flex style={styles.header} gap={12}>
        <Typography type='headline' size='medium'>
          {t('createChannel.leadersStepTitle')}
        </Typography>
        <Typography type='body' size='default' color='textSecondary'>
          {t('createChannel.leadersStepDescription')}
        </Typography>
      </Flex>
      <ChannelUsersList style={commonStyles.baseScreenPadding} type='leader' name='leaders' users={users} />
    </Flex>
  );
};

export default memo(LeadersStep);

const styles = StyleSheet.create({
  header: {
    ...commonStyles.baseScreenPadding,
    marginTop: normalize(30),
  },
});
