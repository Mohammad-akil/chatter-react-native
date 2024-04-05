import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import Stat from '~/ui/Stat';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

type MomentPreviewCardProps = {
  style?: StyleProp<ViewStyle>;
  title: string;
  viewed: number;
  liked: number;
  previewVideo: string;
};

const MomentPreviewCard: FC<MomentPreviewCardProps> = ({ style, title, viewed, liked, previewVideo }) => {
  const cardStyle = [styles.base, style];
  return (
    <Flex style={cardStyle} gap={8}>
      <View style={styles.userImageVideo}>
        <Avatar url={previewVideo} size={173} borderRadius='minimal' />
      </View>
      <Flex gap={4}>
        <Typography type='body' size='small' color='textSecondary'>
          Nelson Epega and 3 others
        </Typography>
        <Typography type='label' size='small' color='textDefault'>
          {title}
        </Typography>
        <Flex flexDirection='row' alignItems='center' gap={4}>
          <Stat iconName='eye' count={viewed} />
          <Stat iconName='heart' count={liked} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(MomentPreviewCard);

const styles = StyleSheet.create({
  base: {
    width: normalize(173),
  },
  userImageVideo: {
    width: normalize(173),
    height: normalize(173),
    borderRadius: normalize(40),
    overflow: 'hidden',
    backgroundColor: colors.surface.surfaceComponent,
  },
});
