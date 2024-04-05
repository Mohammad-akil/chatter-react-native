import { type FC, memo, Dispatch, SetStateAction, useCallback } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Text, View, Pressable } from 'react-native';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { Channel } from '~/entities/Channel';
import { styles } from './styles';
import Flex from '~/ui/Flex';
import { typeOfUploadImage } from '../../state';
import openEditAvatarModal from '../../utils/openEditAvatarModal';
import { useTranslation } from 'react-i18next';
import Avatar from '~/ui/Avatar';
import Typography from '~/ui/Typography';

import UsersStackList from '~/components/UsersStackList';
import IconButton from '~/ui/IconButton';
import ChannelPreview from '../ChannelPreview';

type ChannelInfoOwnerProps = {
  view: 'owner';
  channel: Channel;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedChannelId: string;
  setChannel: SetterOrUpdater<Channel>;
  leadersImages: string[];
};

const ChannelInfoOwner: FC<ChannelInfoOwnerProps> = ({
  view,
  channel,
  setModalIsOpen,
  setChannel,
  selectedChannelId,
  leadersImages = [],
}) => {
  const { t } = useTranslation();
  const setTypeOfImage = useSetRecoilState(typeOfUploadImage);
  const openModal = useCallback(() => {
    if (view === 'owner') {
      setTypeOfImage('avatar');
      setModalIsOpen(true);
    }
  }, [setModalIsOpen, setTypeOfImage, view]);

  const handleChangeAvatar = useCallback(() => {
    if (view === 'owner') {
      openEditAvatarModal(selectedChannelId, openModal, 'avatar', setChannel, t);
    }
  }, [openModal, view, selectedChannelId, setChannel, t]);

  const channelDescription = channel?.description ? channel?.description : t('common.noDescription');

  return (
    <View style={styles.wrapper}>
      <ChannelPreview
        view={view}
        banner={channel.banner}
        setModalIsOpen={setModalIsOpen}
        selectedChannelId={selectedChannelId}
      />
      <Flex flexDirection='row' gap={12}>
        <Pressable onPress={handleChangeAvatar}>
          <Avatar size={80} url={channel?.avatar ?? null} fallbackIcon='images-outline' borderRadius='minimal' />
        </Pressable>

        <Flex flex={1}>
          <Typography type='headline' size='medium'>
            {channel?.name}
          </Typography>
          <Typography type='label' size='small' color='textSecondary'>
            owned by {channel.owner?.first_name} {channel.owner?.last_name}
          </Typography>
        </Flex>
      </Flex>
      <Flex flexDirection='row' alignItems='center' gap={12}>
        <Typography type='label' size='large' style={styles.aeonikText}>
          {channel.follower_count} {t('channel.members')}
        </Typography>

        <Typography type='label' size='large' style={styles.aeonikText}>
          {0} {t('channel.subscribers')}
        </Typography>
      </Flex>
      <Flex flexDirection='row' gap={10}>
        <Flex flex={1}>
          <Typography type='body' size='default'>
            {channelDescription}
          </Typography>
        </Flex>
        <IconButton iconName={'play'} size='3xl' />
      </Flex>
      <Flex style={styles.leaders} gap={8}>
        <Typography type='label' size='large' style={styles.aeonikText}>
          {t('common.leaders')}
        </Typography>
        <UsersStackList images={leadersImages} />
      </Flex>
    </View>
  );
};

export default memo(ChannelInfoOwner);
