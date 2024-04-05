import { FC, memo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import ChatterIcon from '~/ui/ChatterIcon';
import { colorPalette } from '~/styles/colors';

type JoiningRoomProps = {
  action_type: 'start' | 'join';
};

const JoiningRoom: FC<JoiningRoomProps> = ({ action_type }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.base}>
      <Flex alignItems='center' justifyContent='center' gap={8}>
        <ChatterIcon name='chatter-primary-logo' size={40} color={colorPalette.primary400} />
        <Typography type='headline' size='medium'>
          {action_type === 'start' ? t('room.startingRoom') : t('room.joiningRoom')}
        </Typography>
      </Flex>
    </SafeAreaView>
  );
};

export default memo(JoiningRoom);

const styles = StyleSheet.create({
  base: {
    ...commonStyles.baseSafeArea,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
