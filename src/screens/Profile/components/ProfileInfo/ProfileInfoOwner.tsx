import { Dispatch, FC, SetStateAction, memo, useCallback, useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { User } from '~/entities/User';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { abbreviateNumber } from '~/utils/abbreviateNumber';
import openProfileAvatarModal from '../../utils/openProfileAvatarModal';
import { commonStyles } from '~/styles';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import AudioDescriptionPlayer from '../AudioDescriptionPlayer';
import { RecordingStatus } from '~/hooks/useAudioRecorder/types';
import VerifiedIcon from '~/ui/VerifiedIcon';

type ProfileInfoOwnerProps = {
  style?: StyleProp<ViewStyle>;
  user: User;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProfileInfoOwner: FC<ProfileInfoOwnerProps> = memo(({ style, user, setIsModalOpen }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RecordingStatus>('recorded');

  const refresh = useCallback(async () => {
    return queryClient.invalidateQueries({ queryKey: ['me'] });
  }, [queryClient]);

  const handleOpenModal = useCallback(() => {
    if (setIsModalOpen) {
      openProfileAvatarModal(refresh, setIsModalOpen, t);
    }
  }, [setIsModalOpen, refresh, t]);

  const SocialLinks = {
    instagram: {
      deep: `instagram://user?username=`,
      web: `https://www.instagram.com/`,
    },
    twitter: {
      deep: `twitter:///user?screen_name=`,
      web: `https://twitter.com/`,
    },
  };

  function openSocialLink(platform: keyof typeof SocialLinks, handle: string) {
    Linking.canOpenURL(SocialLinks[platform].deep + handle).then((supported) => {
      if (supported) {
        Linking.openURL(SocialLinks[platform].deep + handle);
      } else {
        Linking.openURL(SocialLinks[platform].web + handle);
      }
    });
  }

  return (
    <Flex style={style} gap={24}>
      <Flex gap={16}>
        <Flex flexDirection='row' gap={12}>
          <TouchableOpacity onPress={handleOpenModal}>
            <Avatar url={user.avatar ?? null} size={80} />
          </TouchableOpacity>
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
          <AudioDescriptionPlayer setStatus={setStatus} status={status} />
        </Flex>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='row' gap={8}>
            <IconButton iconName='logo-tiktok' type='text' size='sm' />
            <IconButton
              onPress={() => {
                openSocialLink('instagram', 'justinblakewatson');
              }}
              iconName='logo-instagram'
              type='text'
              size='sm'
            />
            <IconButton iconName='logo-youtube' type='text' size='sm' />
            <IconButton
              onPress={() => {
                openSocialLink('twitter', 'geeken');
              }}
              iconName='logo-twitter'
              type='text'
              size='sm'
            />
          </Flex>
          <Button text={t('profile.joinMyEmailList')} type='text' iconName='link-outline' iconPosition='left' />
        </Flex>
      </Flex>
    </Flex>
  );
});
