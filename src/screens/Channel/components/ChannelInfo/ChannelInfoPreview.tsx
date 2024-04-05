import { type FC, memo, useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ChannelProfile } from '~/entities/Channel';
import Flex from '~/ui/Flex';
import Avatar from '~/ui/Avatar';
import Typography from '~/ui/Typography';
import { useTranslation } from 'react-i18next';
import Button from '~/ui/Button';
import IconButton from '~/ui/IconButton';
import { commonStyles } from '~/styles';
import UsersStackList from '~/components/UsersStackList';
import ChannelPreview from '../ChannelPreview';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

type ChannelInfoPreviewProps = {
  view: 'preview';
  channel: ChannelProfile;

  isFollowing: boolean;
  leadersImages: string[];
};

const ChannelInfoPreview: FC<ChannelInfoPreviewProps> = ({ view, channel, leadersImages, isFollowing }) => {
  const { t } = useTranslation();
  const channelDescription = channel?.description ? channel?.description : t('common.noDescription');
  const queryClient = useQueryClient();

  const followChannel = useCallback(async () => {
    try {
      await api.channel.followChannel(channel.id);
      queryClient.invalidateQueries({ queryKey: ['previewChannel'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [channel.id, queryClient]);

  const unfollowChannel = useCallback(async () => {
    try {
      await api.channel.unfollowChannel(channel.id);
      queryClient.invalidateQueries({ queryKey: ['previewChannel'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [channel.id, queryClient]);

  return (
    <View style={styles.wrapper}>
      <ChannelPreview view={view} banner={channel.banner} />
      <Flex flexDirection='row' gap={12}>
        <Avatar size={80} url={channel?.avatar ?? null} fallbackIcon='images-outline' borderRadius='minimal' />

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

      <Flex flexDirection='row' alignItems='center' gap={4}>
        <Button style={commonStyles.flexFull} text={t('common.subscribe')} iconPosition='right' iconName='star' />
        {isFollowing ? (
          <Button
            text={t('common.following')}
            type='text'
            size='md'
            iconPosition='right'
            iconName='checkmark'
            onPress={unfollowChannel}
            style={commonStyles.flexFull}
          />
        ) : (
          <Button
            text={t('common.follow')}
            type='primary'
            size='md'
            iconPosition='right'
            iconName='add-outline'
            onPress={followChannel}
            style={commonStyles.flexFull}
          />
        )}
        <IconButton iconName='notifications-outline' type='text' />
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

export default memo(ChannelInfoPreview);
