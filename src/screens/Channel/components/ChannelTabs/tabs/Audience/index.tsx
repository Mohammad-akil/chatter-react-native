import { FC, memo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import { channelStyles } from '../../styles';

type AudienceTabProps = {
  view: 'preview' | 'owner';
};

const AudienceTab: FC<AudienceTabProps> = ({ view }) => {
  const { t } = useTranslation();
  return (
    <View style={channelStyles.tabContent}>
      <Typography type='label' size='medium' color='textSecondary'>
        {t('channel.nothingToSeeHere')}
      </Typography>
    </View>
  );
};

export default memo(AudienceTab);
