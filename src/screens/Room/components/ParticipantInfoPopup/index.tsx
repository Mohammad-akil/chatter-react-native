import { type FC, memo, useCallback, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';

import { CustomShowParams } from '~/ui/Toast/types';
import BottomSheet from '~/ui/BottomSheet';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Skeleton from '~/ui/Skeleton';
import Button from '~/ui/Button';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

import ParticipantControls from './ParticipantControls';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type ParticipantInfoPopupProps = {
  style?: StyleProp<ViewStyle>;
};

const ParticipantInfoPopup: FC<ParticipantInfoPopupProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();
  const [storageUser] = useStorageUser();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const currentRole = useRecoilValue(state.currentRoleState);
  const [participantInfoPopup, setParticipantInfoPopup] = useRecoilState(state.participantInfoPopupState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const { isPending: loading, data } = useQuery({
    queryKey: ['room/participantInfo', participantInfoPopup.participantInfo?.user_id],
    queryFn: () => {
      if (participantInfoPopup.participantInfo?.user_id) {
        return api.profile.getProfile(participantInfoPopup.participantInfo.user_id);
      }
    },
    enabled: !!participantInfoPopup.participantInfo?.user_id,
  });

  const userOwnsProfile = useMemo(() => {
    return storageUser?.id === data?.user?.id;
  }, [storageUser, data]);

  const setParticipantInfoPopupOpened = useCallback(() => {
    setParticipantInfoPopup({
      open: false,
      participantInfo: null,
    });
  }, [setParticipantInfoPopup]);

  const showRoomControls = useCallback(() => {
    setRoomControlsOpened(true);
  }, [setRoomControlsOpened]);

  const goToUserProfile = useCallback(() => {
    if (data?.user?.id) {
      navigate('PreviewProfile', { user_id: data.user.id });
    }
  }, [navigate, data?.user?.id]);

  const followUser = useCallback(async () => {
    if (!data?.user.id) {
      return;
    }
    try {
      await api.profile.followUser({ followee_id: data.user.id });
      queryClient.invalidateQueries({ queryKey: ['room/participantInfo'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [data?.user.id, queryClient]);

  const unfollowUser = useCallback(async () => {
    if (!data?.user.id) {
      return;
    }
    try {
      await api.profile.unfollowUser(data.user.id);
      queryClient.invalidateQueries({ queryKey: ['room/participantInfo'] });
    } catch (e) {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);
    }
  }, [data?.user.id, queryClient]);

  if (!data) {
    return null;
  }

  return (
    <BottomSheet
      style={styles.popup}
      open={participantInfoPopup.open}
      setOpened={setParticipantInfoPopupOpened}
      buttons={
        <ParticipantControls
          loading={loading}
          roomId={roomDetails?.id}
          currentParticipantRole={currentRole}
          selectedParticipant={participantInfoPopup.participantInfo}
          onClosePopup={showRoomControls}
        />
      }
      onDismiss={showRoomControls}
    >
      {loading ? (
        <Flex style={styles.content} gap={8}>
          <Flex flexDirection='row' gap={12}>
            <Skeleton width={80} height={80} borderRadius={6} />
            <Flex gap={4} flex={1}>
              <Skeleton width={'100%'} height={34} borderRadius={6} />
              <Skeleton width={'40%'} height={18} borderRadius={6} />
            </Flex>
          </Flex>
          <Skeleton width={'100%'} height={36} borderRadius={6} />
          <Flex flexDirection='row' justifyContent='space-between'>
            <Skeleton width={'50%'} height={40} borderRadius={6} />
            <Skeleton width={'30%'} height={40} borderRadius={6} />
          </Flex>
          {!userOwnsProfile && (
            <Flex flexDirection='row' gap={4}>
              <Skeleton style={commonStyles.flexFull} width={'50%'} height={40} borderRadius={6} />
              <Skeleton style={commonStyles.flexFull} width={'50%'} height={40} borderRadius={6} />
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex style={styles.content} gap={8}>
          <Flex flexDirection='row' gap={12}>
            <Avatar url={data.user.avatar ?? null} size={80} borderRadius='minimal' />
            <Flex flex={1}>
              <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Typography type='headline' size='small'>{`${data.user.first_name} ${data.user.last_name}`}</Typography>
                <IconButton type='text' size='xl' iconName='ellipsis-horizontal' />
              </Flex>
              <Typography type='label' size='small' color='textSecondary'>
                @{data.user.username}
              </Typography>
            </Flex>
          </Flex>
          {data.user.profile_description && (
            <Typography numberOfLines={2} type='body' size='default'>
              {data.user.profile_description}
            </Typography>
          )}

          <Flex flexDirection='row' justifyContent='space-between'>
            <Flex flexDirection='row'>
              <IconButton type='text' size='md' iconName='logo-tiktok' />
              <IconButton type='text' size='md' iconName='logo-instagram' />
              <IconButton type='text' size='md' iconName='logo-youtube' />
              <IconButton type='text' size='md' iconName='logo-twitter' />
            </Flex>
            <Button type='text' size='sm' text={t('common.viewFullProfile')} onPress={goToUserProfile} />
          </Flex>
          {!userOwnsProfile && (
            <Flex flexDirection='row' gap={4}>
              <Button
                text={t('common.message').split('...')[0]}
                style={commonStyles.flexFull}
                type='ghost'
                size='md'
                iconPosition='right'
                iconName='chatbubbles'
              />
              {data.metadata.is_following ? (
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
          )}
        </Flex>
      )}
    </BottomSheet>
  );
};

export default memo(ParticipantInfoPopup);

const styles = StyleSheet.create({
  popup: {
    marginHorizontal: normalize(16),
  },
  content: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.surface.surfaceComponent,
  },
});
