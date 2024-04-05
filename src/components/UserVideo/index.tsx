import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';

import NameTag from '~/ui/NameTag';
import Avatar from '~/ui/Avatar';

import { normalize } from '~/utils/normalize';

type UserVideoProps = {
  style?: StyleProp<ViewStyle>;
  avatar: string | null;
  name: string;
  size?: number;
  isVerified: boolean;
};

const UserVideo: FC<UserVideoProps> = ({ style, avatar, name, size = 72, isVerified }) => {
  const containerStyle = [
    styles.base,
    {
      width: normalize(size),
      height: normalize(size),
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Avatar url={avatar} size={size} borderRadius='minimal' />
      <NameTag isVerified={isVerified} style={styles.nameTag} option='sub' withBackground>
        {name}
      </NameTag>
    </View>
  );
};

export default memo(UserVideo);

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderRadius: 6,
    flex: 1,
  },
  nameTag: {
    position: 'absolute',
    flex: 1,
    right: 4,
    bottom: 4,
  },
});
