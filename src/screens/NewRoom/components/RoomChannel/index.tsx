import { FC, memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { useTranslation } from 'react-i18next';

type RoomChannelProps = {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
};

export const RoomChannel: FC<RoomChannelProps> = memo(({ style, edit = false }) => {
  const { t } = useTranslation();

  return (
    <AnimatedFlex gap={16} style={style}>
      {edit && (
        <Flex gap={4}>
          <Typography color='textLabel' type='label' size='large'>
            {t('common.channel')}
          </Typography>
          <Typography color='textSecondary' type='body' size='default'>
            {t('room.thisRoomWillGo')}
          </Typography>
        </Flex>
      )}
      <Flex gap={12} flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Flex flexDirection='row' flex={1} gap={16}>
          <Avatar
            url={
              'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            }
            size={40}
            borderRadius='minimal'
          />
          <Typography numberOfLines={2} style={commonStyles.flexFull} type='label' size='large'>
            Understanding our World
          </Typography>
        </Flex>
        {edit && <Button type='text' size='sm' text={t('common.change')} />}
      </Flex>
    </AnimatedFlex>
  );
});
