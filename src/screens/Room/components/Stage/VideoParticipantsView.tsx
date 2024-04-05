import { type FC, memo, useMemo, useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Participant } from 'livekit-client';

import { StageParticipant } from '~/entities/Room';
import { UserMetadata } from '~/entities/User';

import Flex from '~/ui/Flex';
import RequestToJoin from './RequestToJoin';
import {
  LivekitStageVideoParticipantItem,
  StageVideoParticipantItem,
} from '../StageParticipant/StageVideoParticipantItem';
import { useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';

type VideoParticipantsViewProps = {
  style?: StyleProp<ViewStyle>;
  participants: StageParticipant[] | Participant[];
  openParticipantInfo: (participant: UserMetadata) => void;
};

const getBorder = (index: number, countOfItems: number): StyleProp<ViewStyle> => {
  if (countOfItems === 1) {
    return {
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    };
  }

  if (countOfItems === 2) {
    return {
      borderTopLeftRadius: index === 0 ? 30 : 8,
      borderTopRightRadius: index === 1 ? 30 : 8,
      borderBottomLeftRadius: index === 0 ? 30 : 8,
      borderBottomRightRadius: index === 1 ? 30 : 8,
    };
  }

  return {
    borderTopLeftRadius: index === 0 ? 30 : 8,
    borderTopRightRadius: index === 1 ? 30 : 8,
    borderBottomLeftRadius: index === 2 ? 30 : 8,
    borderBottomRightRadius: index === 3 ? 30 : 8,
  };
};

const VideoParticipantsView: FC<VideoParticipantsViewProps> = ({ style, participants, openParticipantInfo }) => {
  const currentRoomProvider = useRecoilValue(state.currentRoomProviderState);
  const currentRole = useRecoilValue(state.currentRoleState);

  const showRequestToJoinButton = useMemo(() => {
    return participants.length === 3 && currentRole === 'listener';
  }, [participants, currentRole]);

  const renderSocketParticipants = useCallback(() => {
    return (participants as StageParticipant[]).map((participant, index) => {
      const _openParticipantInfo = () => {
        openParticipantInfo(participant.metadata);
      };

      const lastElement = index === participants.length - 1;
      const size = participants.length === 1 ? 360 : 170;
      const borderStyles = getBorder(index, participants.length);

      if (lastElement && showRequestToJoinButton) {
        return (
          <Flex flexDirection='row' alignItems='center' justifyContent='center' gap={4} key={participant.sid}>
            <TouchableOpacity activeOpacity={0.8} onPress={_openParticipantInfo}>
              <StageVideoParticipantItem
                size={size}
                borderStyles={borderStyles}
                user_id={participant.metadata.user_id}
                role={participant.metadata.role}
                first_name={participant.metadata.user_first_name}
                isSpeaking={participant.isSpeaking}
                verified={participant.metadata.verified}
                camera_url={participant.camera_url!}
              />
            </TouchableOpacity>
            <RequestToJoin size={size} />
          </Flex>
        );
      }

      return (
        <TouchableOpacity activeOpacity={0.8} key={participant.sid} onPress={_openParticipantInfo}>
          <StageVideoParticipantItem
            size={size}
            user_id={participant.metadata.user_id}
            borderStyles={borderStyles}
            role={participant.metadata.role}
            first_name={participant.metadata.user_first_name}
            isSpeaking={participant.isSpeaking}
            verified={participant.metadata.verified}
            camera_url={participant.camera_url!}
          />
        </TouchableOpacity>
      );
    });
  }, [participants, showRequestToJoinButton, openParticipantInfo]);

  const renderLivekitParticipants = useCallback(() => {
    return (participants as Participant[]).map((participant, index) => {
      const _openParticipantInfo = () => {
        const userData: UserMetadata = JSON.parse(participant.metadata!);
        openParticipantInfo(userData);
      };

      const lastElement = index === participants.length - 1;
      const size = participants.length === 1 ? 360 : 170;
      const borderStyles = getBorder(index, participants.length);

      if (lastElement && showRequestToJoinButton) {
        return (
          <Flex flexDirection='row' alignItems='center' justifyContent='center' gap={4} key={participant.sid}>
            <TouchableOpacity activeOpacity={0.8} onPress={_openParticipantInfo}>
              <LivekitStageVideoParticipantItem borderStyles={borderStyles} size={size} participant={participant} />
            </TouchableOpacity>
            <RequestToJoin />
          </Flex>
        );
      }

      return (
        <TouchableOpacity activeOpacity={0.8} key={participant.sid} onPress={_openParticipantInfo}>
          <LivekitStageVideoParticipantItem borderStyles={borderStyles} size={size} participant={participant} />
        </TouchableOpacity>
      );
    });
  }, [participants, showRequestToJoinButton, openParticipantInfo]);

  return (
    <Flex style={style}>
      <Flex flexDirection='row' flexWrap='wrap' justifyContent='space-between'>
        {currentRoomProvider === 'livekit' ? renderLivekitParticipants() : renderSocketParticipants()}
      </Flex>
    </Flex>
  );
};

export default memo(VideoParticipantsView);
