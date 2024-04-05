import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';

import { ParticipantRole } from '~/entities/Room';
import { UserMetadata } from '~/entities/User';

import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { ROOM_REMOVED_USERS_QUERY_KEY } from '../../queries/useRemovedUsers';
import { useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type ParticipantControlsProps = {
  style?: StyleProp<ViewStyle>;
  loading: boolean;
  roomId?: string;
  currentParticipantRole: ParticipantRole | null;
  selectedParticipant: UserMetadata | null;
  onClosePopup: () => void;
};

const ParticipantControls: FC<ParticipantControlsProps> = ({
  loading,
  roomId,
  currentParticipantRole,
  selectedParticipant,
  onClosePopup,
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const setParticipantInfoPopup = useSetRecoilState(state.participantInfoPopupState);

  const moveToAudience = useCallback(async () => {
    if (roomId && selectedParticipant?.user_id) {
      await api.room.moveToAudience({
        room_id: roomId,
        user_id: selectedParticipant.user_id,
      });
      setParticipantInfoPopup({
        open: false,
        participantInfo: null,
      });
      onClosePopup();
    }
  }, [roomId, selectedParticipant, setParticipantInfoPopup, onClosePopup]);

  const inviteUserToSpeak = useCallback(async () => {
    if (roomId && selectedParticipant?.user_id) {
      await api.room.inviteToSpeak({ room_id: roomId, user_id: selectedParticipant.user_id });
      setParticipantInfoPopup({
        open: false,
        participantInfo: null,
      });
      onClosePopup();
    }
  }, [roomId, selectedParticipant, setParticipantInfoPopup, onClosePopup]);

  const removeUserFromRoom = useCallback(async () => {
    if (roomId && selectedParticipant?.user_id) {
      await api.room.removeUser({
        room_id: roomId,
        user_id: selectedParticipant.user_id,
      });
      queryClient.invalidateQueries({ queryKey: [ROOM_REMOVED_USERS_QUERY_KEY] });
      setParticipantInfoPopup({
        open: false,
        participantInfo: null,
      });
      onClosePopup();
    }
  }, [roomId, selectedParticipant, setParticipantInfoPopup, queryClient, onClosePopup]);

  if (loading) {
    return undefined;
  }

  if (currentParticipantRole === 'host' && selectedParticipant?.role === 'listener') {
    return (
      <Flex gap={8}>
        <Button
          type='red'
          text={t('room.removeFromRoom')}
          iconPosition='right'
          iconName='ban-outline'
          onPress={removeUserFromRoom}
        />
        <Button
          type='secondary'
          text={t('room.inveiteToStage')}
          iconPosition='right'
          iconName='send'
          onPress={inviteUserToSpeak}
        />
        <Button type='primary' text={t('room.makeModerator')} iconPosition='right' iconName='shield' />
      </Flex>
    );
  }

  if (currentParticipantRole === 'host' && selectedParticipant?.role === 'speaker') {
    return (
      <Flex gap={8}>
        <Button
          type='red'
          text={t('room.removeFromRoom')}
          iconPosition='right'
          iconName='ban-outline'
          onPress={removeUserFromRoom}
        />
        <Button
          type='red'
          text={t('room.moveToAudience')}
          iconPosition='right'
          iconName='arrow-down-outline'
          onPress={moveToAudience}
        />
        <Button type='primary' text={t('room.makeModerator')} iconPosition='right' iconName='shield' />
      </Flex>
    );
  }

  return undefined;
};

export default memo(ParticipantControls);
