import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { Room, RoomOld } from '~/entities/Room';

import RoomPreviewCard from '~/components/RoomPreviewCard';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';

type PastRoomsProps = {
  style?: StyleProp<ViewStyle>;
  rooms: Room[];
};

const PastRooms: FC<PastRoomsProps> = ({ style, rooms }) => {
  const { t } = useTranslation();
  return (
    <Flex style={style} gap={16}>
      <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography type='label' size='large' style={commonStyles.aeonikRegular}>
          {t('profile.pastRooms')}
        </Typography>
        <Button text={t('common.viewAll')} type='text' size='md' />
      </Flex>
      <Flex gap={8}>
        {rooms.map((room) => {
          return <RoomPreviewCard key={room.id} isList room={room} />;
        })}
      </Flex>
    </Flex>
  );
};

export default memo(PastRooms);
