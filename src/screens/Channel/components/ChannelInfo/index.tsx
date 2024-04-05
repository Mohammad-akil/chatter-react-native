import { type FC, memo, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import UsersStackList from '~/components/UsersStackList';
import Avatar from '~/ui/Avatar';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import ChannelPreview from '../ChannelPreview';

import { styles } from './styles';
import { normalize } from '~/utils/normalize';
import IconButton from '~/ui/IconButton';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { typeOfUploadImage } from '../../state';
import openEditAvatarModal from '../../utils/openEditAvatarModal';

import { Dispatch, SetStateAction } from 'react';
import { Channel, ChannelProfile } from '~/entities/Channel';
import { useStorageUser } from '~/services/mmkv/auth';
import Button from '~/ui/Button';
import { commonStyles } from '~/styles';
import ChannelInfoOwner from './ChannelInfoOwner';
import ChannelInfoPreview from './ChannelInfoPreview';

type OwnerProps = {
  view: 'owner';
  channel: Channel;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedChannelId: string;
  setChannel: SetterOrUpdater<Channel>;
  isFollowing?: undefined;
};

type PreviewProps = {
  view: 'preview';
  channel: ChannelProfile;
  setModalIsOpen?: undefined;
  selectedChannelId?: undefined;
  setChannel?: undefined;
  isFollowing: boolean;
};

export type ChannelInfoProps = {
  leadersImages?: string[];
  members?: string;
  subscribers?: string;
} & (OwnerProps | PreviewProps);

const ChannelInfo: FC<ChannelInfoProps> = ({
  channel,
  view,
  isFollowing,
  selectedChannelId,
  leadersImages = [],
  setModalIsOpen,
  setChannel,
}) => {
  const { t } = useTranslation();
  const [storageUser] = useStorageUser();

  const userOwnsChannel = useMemo(() => {
    return storageUser?.id === channel.owner?.id;
  }, [storageUser, channel]);

  return view === 'owner' || userOwnsChannel ? (
    <ChannelInfoOwner
      view='owner'
      channel={channel}
      leadersImages={leadersImages}
      selectedChannelId={selectedChannelId!}
      setModalIsOpen={setModalIsOpen!}
      setChannel={setChannel!}
    />
  ) : (
    <ChannelInfoPreview view='preview' channel={channel} isFollowing={isFollowing} leadersImages={leadersImages} />
  );
};

export default memo(ChannelInfo);
