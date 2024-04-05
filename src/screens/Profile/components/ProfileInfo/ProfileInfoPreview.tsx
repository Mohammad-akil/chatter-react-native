import { FC, memo, useCallback } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { UserProfile } from '~/entities/User';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { abbreviateNumber } from '~/utils/abbreviateNumber';
import { commonStyles } from '~/styles';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import { api } from '~/api';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import VerifiedIcon from '~/ui/VerifiedIcon';

type ProfileInfoPreviewProps = {
  style?: StyleProp<ViewStyle>;
  isFollowing: boolean;
  user: UserProfile;
};

export const ProfileInfoPreview: FC<ProfileInfoPreviewProps> = memo(({ style, user, isFollowing }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const followUser = useCallback(async () => {
    try {
      await api.profile.followUser({ followee_id: user.id });
      queryClient.invalidateQueries({ queryKey: ['previewProfile'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [user.id, queryClient]);

  const unfollowUser = useCallback(async () => {
    try {
      await api.profile.unfollowUser(user.id);
      queryClient.invalidateQueries({ queryKey: ['previewProfile'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [user.id, queryClient]);

  return (
    <Flex style={style} gap={24}>
      <Flex gap={16}>
        <Flex flexDirection='row' gap={12}>
          <Avatar url={user.avatar ?? null} size={80} />
          <Flex flex={1}>
            {user.verified && (
              <Flex flexDirection='row' gap={4}>
                <VerifiedIcon />
                <Typography type='label' size='small'>
                  {t('common.verified')}
                </Typography>
              </Flex>
            )}
            <Typography type='headline' size='medium' color='textLabel' numberOfLines={2}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography type='label' size='small' color='textSecondary'>
              @{user?.username}
            </Typography>
          </Flex>
        </Flex>
        <Flex flexDirection='row' gap={12}>
          <Pressable
            onPress={() => {
              navigation.navigate('FollowingList', { view: 'followers', user: user });
            }}
          >
            <Typography type='label' size='large' color='textLabel'>
              {abbreviateNumber(user.follower_count, 2)} {t('profile.followers')}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('FollowingList', { view: 'following', user: user });
            }}
          >
            <Typography type='label' size='large' color='textLabel'>
              {abbreviateNumber(user.following_count, 2)} {t('profile.following')}
            </Typography>
          </Pressable>
        </Flex>
        <Flex flexDirection='row' alignItems='center' gap={10}>
          <Typography
            style={commonStyles.flexFull}
            type='body'
            size='default'
            color='textSecondary'
            numberOfLines={3}
            ellipsizeMode='tail'
          >
            {user?.profile_description
              ? user.profile_description
              : `We don't know much about them, but we're sure ${user?.first_name} is great.`}
          </Typography>
          <IconButton iconName='play' type='secondary' size='3xl' />
        </Flex>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='row' gap={8}>
            <IconButton iconName='logo-tiktok' type='text' size='sm' />
            <IconButton iconName='logo-instagram' type='text' size='sm' />
            <IconButton iconName='logo-youtube' type='text' size='sm' />
            <IconButton iconName='logo-twitter' type='text' size='sm' />
          </Flex>
          <Button text={t('profile.joinMyEmailList')} type='text' iconName='link-outline' iconPosition='left' />
        </Flex>
        <Flex flexDirection='row' gap={4}>
          <Button
            text={t('common.message').split('...')[0]}
            type='ghost'
            size='md'
            iconPosition='right'
            iconName='chatbubbles'
            style={commonStyles.flexFull}
          />
          {isFollowing ? (
            <Button
              text={t('common.following')}
              type='text'
              size='md'
              iconPosition='right'
              iconName='checkmark'
              onPress={unfollowUser}
              style={commonStyles.flexFull}
            />
          ) : (
            <Button
              text={t('common.follow')}
              type='primary'
              size='md'
              iconPosition='right'
              iconName='add-outline'
              onPress={followUser}
              style={commonStyles.flexFull}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
});
