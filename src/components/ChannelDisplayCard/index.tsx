import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

import CircleDivider from '~/ui/CircleDivider';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

type ChannelDisplayCardProps = {
  style?: StyleProp<ViewStyle>;
  avatar?: string | null;
  title: string;
};

const ChannelDisplayCard: FC<ChannelDisplayCardProps> = ({ style, avatar, title }) => {
  const cardStyles = [styles.base, style];

  return (
    <View style={cardStyles}>
      <Avatar size={173} url={avatar ?? null} borderRadius='minimal' />
      <LinearGradient colors={['#00000000', '#000000']} useAngle angle={180} style={styles.gradient}>
        <Typography numberOfLines={2} style={commonStyles.aeonikRegular} type='label' size='large'>
          {title}
        </Typography>
        <Flex flexDirection='row' alignItems='center' gap={4}>
          <Typography type='body' size='default' color='textSecondary'>
            Cinema
          </Typography>
          <CircleDivider />
          <Typography type='body' size='default' color='textSecondary'>
            Film
          </Typography>
        </Flex>
      </LinearGradient>
    </View>
  );
};

export default memo(ChannelDisplayCard);

const styles = StyleSheet.create({
  base: {
    width: normalize(173),
    height: normalize(173),
  },
  gradient: {
    width: normalize(173),
    height: normalize(173),
    padding: 4,
    borderRadius: 6,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
});
