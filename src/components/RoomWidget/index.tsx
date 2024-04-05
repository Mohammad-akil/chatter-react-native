import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Dimensions } from 'react-native';
import { colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Stat from '~/ui/Stat';
import Typography from '~/ui/Typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { normalize } from '~/utils/normalize';
import IconButton from '~/ui/IconButton';

type RoomWidgetProps = {
  style?: StyleProp<ViewStyle>;
};

const RoomWidget: FC<RoomWidgetProps> = ({ style }) => {
  return (
    <Flex flexDirection='row' gap={16} style={[styles.base, style]}>
      <Flex flex={1} gap={4}>
        <Flex flex={1} flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Flex gap={4} flexDirection='row'>
            <Stat iconName='person-circle-outline' count={1345} />
            <Stat iconName='chatbubbles' count={120} />
          </Flex>
          <Flex gap={4} flexDirection='row'>
            <Icon name='mic' size={normalize(16)} color={colors.text.textSecondary} />
            <Typography type='label' size='small' color='textSecondary'>
              Vasyl
            </Typography>
          </Flex>
        </Flex>
        <Typography numberOfLines={1} type='label' size='medium'>
          Deep Blue Dialogue: Saving Our Oceans
        </Typography>
      </Flex>
      <Flex alignItems='center' flexDirection='row' gap={4}>
        <IconButton type='secondary' size='2xl' iconName='mic-off-outline' />
        <IconButton type='red' size='2xl' iconName='close-outline' />
      </Flex>
    </Flex>
  );
};

export default memo(RoomWidget);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.surfaceComponent,
    padding: 8,
    borderRadius: 6,
    width: Dimensions.get('screen').width - 40,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
