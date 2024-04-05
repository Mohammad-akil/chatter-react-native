import { FC, memo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import { channelStyles } from '../../styles';

type MomentsTabProps = {
  view: 'preview' | 'owner';
};

const MomentsTab: FC<MomentsTabProps> = ({ view }) => {
  const { t } = useTranslation();
  return (
    <View style={channelStyles.tabContent}>
      <Typography type='label' size='medium' color='textSecondary'>
        {t('channel.nothingToSeeHere')}
      </Typography>
      {view === 'owner' && <Button text={t('channel.createAMoment')} type='ghost' />}
    </View>
  );
};

export default memo(MomentsTab);
