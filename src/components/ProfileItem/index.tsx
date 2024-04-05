import { type FC, memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import NameTag from '~/ui/NameTag';
import Typography from '~/ui/Typography';

type ProfileItemProps = {
  style?: StyleProp<ViewStyle>;
  size?: 'small' | 'large';
  option?: 'mod' | 'sub' | 'both';
  avatar: string | null;
  userName?: string;
  firstName: string;
  lastName?: string;
  isVerified?: boolean;
};

const ProfileItem: FC<ProfileItemProps> = ({
  size = 'large',
  avatar,
  userName,
  firstName,
  lastName,
  isVerified,
  option,
  style,
}) => {
  const avatarSize = size === 'large' ? 48 : 40;

  const displayNameSize = size === 'large' ? 'large' : 'default';
  const userNameSize = size === 'large' ? 'label' : 'body';
  return (
    <Flex style={style} flexDirection='row' alignItems='center' gap={10}>
      <Avatar url={avatar} size={avatarSize} />
      <Flex alignItems='flex-start' gap={2}>
        <NameTag isVerified={isVerified} withoutPaddings option={option} size={displayNameSize}>
          {firstName} {lastName}
        </NameTag>
        {userName && (
          <Typography type={userNameSize} size='small' color='textSecondary'>
            @{userName}
          </Typography>
        )}
      </Flex>
    </Flex>
  );
};

export default memo(ProfileItem);
