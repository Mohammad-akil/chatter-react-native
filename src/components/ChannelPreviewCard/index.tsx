import { type FC, memo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { abbreviateNumber } from '~/utils/abbreviateNumber';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

type ChannelPreviewCardProps = {
  style?: StyleProp<ViewStyle>;
  title: string;
  members: number;
  avatar?: string | null;
  owner: string;
};

const ChannelPreviewCard: FC<ChannelPreviewCardProps> = ({ style, title, avatar, members, owner }) => {
  const cardStyle = [styles.base, style];
  return (
    <Flex style={cardStyle} gap={4}>
      <Avatar url={avatar ?? null} borderRadius='minimal' size={173} />
      <Typography style={commonStyles.aeonikRegular} type='label' size='large' color='textLabel' numberOfLines={2}>
        {title}
      </Typography>
      <Typography type='label' size='small' color='textLabel'>
        {abbreviateNumber(members, 2)} members
      </Typography>
      <Typography type='label' size='small' color='textSecondary'>
        by @{owner}
      </Typography>
    </Flex>
  );
};

export default memo(ChannelPreviewCard);

const styles = StyleSheet.create({
  base: {
    width: normalize(173),
  },
});
