import { type FC, memo, Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { useStorageUser } from '~/services/mmkv/auth';
import { User, UserProfile } from '~/entities/User';

import Skeleton from '~/ui/Skeleton';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { ProfileInfoPreview } from './ProfileInfoPreview';
import { ProfileInfoOwner } from './ProfileInfoOwner';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type PreviewProps = {
  view: 'preview';
  isFollowing: boolean;
  user: UserProfile;
  setIsModalOpen?: undefined;
};

type OwnerProps = {
  view: 'owner';
  user: User;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isFollowing?: undefined;
};

type ProfileInfoProps = {
  style?: StyleProp<ViewStyle>;
  loading: boolean;
} & (OwnerProps | PreviewProps);

const ProfileInfo: FC<ProfileInfoProps> = ({ style, view, user, loading, isFollowing, setIsModalOpen }) => {
  const [storageUser] = useStorageUser();

  const userOwnsProfile = useMemo(() => {
    return storageUser?.id === user.id;
  }, [storageUser, user]);

  if (loading) {
    return (
      <Flex style={style} gap={24}>
        <Flex flexDirection='row' gap={12}>
          <Skeleton width={80} height={80} borderRadius={360} />
          <Flex flex={1} gap={8}>
            <Skeleton width={'100%'} height={32} borderRadius={6} />
            <Skeleton width={'50%'} height={18} borderRadius={6} />
          </Flex>
        </Flex>
        <Flex flexDirection='row' gap={12}>
          <Skeleton width={'60%'} height={24} borderRadius={6} />
        </Flex>
        <Flex flexDirection='row' alignItems='center' gap={10}>
          <Skeleton style={commonStyles.flexFull} width={'100%'} height={68} borderRadius={6} />
          <Skeleton width={68} height={68} borderRadius={360} />
        </Flex>
        <Flex flexDirection='row' gap={4}>
          <Skeleton style={commonStyles.flexFull} width={'100%'} height={40} borderRadius={6} />
          <Skeleton style={commonStyles.flexFull} width={'100%'} height={40} borderRadius={6} />
        </Flex>
      </Flex>
    );
  }

  return view === 'owner' || userOwnsProfile ? (
    <ProfileInfoOwner style={style} user={user as User} setIsModalOpen={setIsModalOpen!} />
  ) : (
    <ProfileInfoPreview style={style} user={user} isFollowing={isFollowing} />
  );
};

export default memo(ProfileInfo);
