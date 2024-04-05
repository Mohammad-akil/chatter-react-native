import { FC, memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import PrivacySelect from './PrivacySelect';
import Typography from '~/ui/Typography';
import Flex, { AnimatedFlex } from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { useRecoilValue } from 'recoil';
import { roomState } from '../../state';
import { useTranslation } from 'react-i18next';
import { LinearTransition } from 'react-native-reanimated';
import { getPrivacyOptions } from './options';
import { Language } from '~/i18n/types';

type RoomPrivacyProps = {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
};

export const RoomPrivacy: FC<RoomPrivacyProps> = memo(({ style, edit = false }) => {
  const { t, i18n } = useTranslation();
  const roomData = useRecoilValue(roomState);

  const privacyOptions = useMemo(() => getPrivacyOptions(i18n.language as Language), [i18n.language]);

  return (
    <AnimatedFlex
      layout={LinearTransition.duration(300)}
      style={style}
      gap={8}
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
    >
      <Flex gap={4} flex={1}>
        <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
          {t('room.privacy')}
        </Typography>
        <Typography type='body' size='default' color='textSecondary'>
          {privacyOptions[roomData.privacy].description}
        </Typography>
      </Flex>
      {edit ? (
        <PrivacySelect />
      ) : (
        <Typography type='label' size='small' color='white'>
          {privacyOptions[roomData.privacy].label}
        </Typography>
      )}
    </AnimatedFlex>
  );
});
