import { FC, memo, useCallback } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import { channelStyles } from '../../styles';

type RoomsTabProps = {
  view: 'preview' | 'owner';
};

const RoomsTab: FC<RoomsTabProps> = ({ view }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const goToNewRoom = useCallback(() => {
    navigate('NewRoom');
  }, [navigate]);

  return (
    <View style={channelStyles.tabContent}>
      <Typography type='label' size='medium' color='textSecondary'>
        {t('channel.nothingToSeeHere')}
      </Typography>
      {view === 'owner' && <Button text={t('channel.createARoom')} type='ghost' onPress={goToNewRoom} />}
    </View>
  );
};

export default memo(RoomsTab);
