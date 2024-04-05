import { type FC, memo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { roomLive, type Room } from '~/entities/Room';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import CardHeader from './components/CardHeader';
import ListView from './components/ListView';
import GridView from './components/GridView';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { commonStyles } from '~/styles';

type RoomPreviewCardProps = {
  style?: StyleProp<ViewStyle>;
  room: Room;
  isList?: boolean;
};

const RoomPreviewCard: FC<RoomPreviewCardProps> = ({ isList = false, room, style }) => {
  const { title: roomTitle, description: roomDescription } = room;

  const flexDirection = isList ? 'row' : 'column';
  const gap = isList ? normalize(12) : normalize(20);
  const flex = isList ? 1 : 0;

  return (
    <Flex gap={8} style={[styles.base, isList && styles.listView, style]}>
      <CardHeader room={room} />
      <Flex gap={gap} flexDirection={flexDirection}>
        <Flex flex={flex} gap={4}>
          <Typography type='label' size='large' color='textLabel' style={commonStyles.aeonikRegular}>
            {roomTitle}
          </Typography>
          <Typography type='label' size='small' color='textSecondary' numberOfLines={2}>
            {roomDescription}
          </Typography>
          {isList && roomLive.tags.length > 0 && (
            <Flex style={styles.roomTag} justifyContent='center'>
              <Typography type='body' style={{ fontSize: 12 }} color='textDefault'>
                {roomLive.tags.map((item, index) => (index === roomLive.tags.length - 1 ? item : item + ' • '))}
              </Typography>
            </Flex>
          )}
        </Flex>
        {isList ? <ListView room={room} /> : <GridView room={room} />}
      </Flex>
    </Flex>
  );
};

export default memo(RoomPreviewCard);

const styles = StyleSheet.create({
  base: {
    padding: normalize(12),
    borderRadius: 6,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  roomTag: {
    padding: 0,
    borderWidth: 0,
    elevation: 0,
  },
  listView: {
    backgroundColor: colors.surface.surfaceComponent,
  },
});
