import { BlurView } from '@react-native-community/blur';
import { memo, type FC, useRef, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View, Text } from 'react-native';
import Video from 'react-native-video';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import VerifiedIcon from '~/ui/VerifiedIcon';
import { normalize } from '~/utils/normalize';

import { colorPalette } from '~/styles/colors';
import { ParticipantRole } from '~/entities/Room';
import { Participant } from 'livekit-client';
import { VideoView, useParticipant } from '@livekit/react-native';
import { UserMetadata } from '~/entities/User';
import { useReaction } from '../../hooks/useReaction';

type StageVideoParticipantItemProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  borderStyles?: StyleProp<ViewStyle>;
  role: ParticipantRole;
  first_name: string;
  isSpeaking: boolean;
  user_id: string;
  verified: boolean;
  camera_url: string;
};

export const StageVideoParticipantItem: FC<StageVideoParticipantItemProps> = memo(
  ({ style, role, first_name, user_id, borderStyles, isSpeaking, verified, camera_url, size = 170 }) => {
    const displayRole = role[0].toUpperCase() + role.slice(1);
    const playerRef = useRef<Video>(null);
    const { reaction } = useReaction(user_id);

    const videoContainerStyles = useMemo(() => {
      return [
        styles.videoContainer,
        {
          minWidth: normalize(size),
          minHeight: normalize(size),
        },
        borderStyles,
      ];
    }, [size, borderStyles]);

    const border = useMemo(() => {
      return [styles.isSpeaking, { minWidth: normalize(size), minHeight: normalize(size) }, borderStyles];
    }, [size, borderStyles]);

    return (
      <View style={style}>
        <View style={videoContainerStyles}>
          <Video ref={playerRef} volume={0} style={styles.video} source={{ uri: camera_url }} />
          {reaction && (
            <>
              <Text style={styles.emoji}>{reaction}</Text>
            </>
          )}
          <BlurView style={styles.name}>
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Flex flexDirection='row' alignItems='center' gap={2}>
                {verified && <VerifiedIcon />}
                <Typography type='body' size='semibold'>
                  {first_name}
                </Typography>
              </Flex>
              <Typography type='body' size='default'>
                {displayRole}
              </Typography>
            </Flex>
          </BlurView>
        </View>

        {isSpeaking && <View style={border} />}
      </View>
    );
  },
);

type LivekitStageVideoParticipantItemProps = {
  style?: StyleProp<ViewStyle>;
  borderStyles?: StyleProp<ViewStyle>;
  participant: Participant;
  size?: number;
};

export const LivekitStageVideoParticipantItem: FC<LivekitStageVideoParticipantItemProps> = memo(
  ({ style, size = 170, borderStyles, participant }) => {
    const { cameraPublication } = useParticipant(participant);
    const userMetadata: UserMetadata = JSON.parse(participant.metadata!);
    const displayRole = userMetadata.role[0].toUpperCase() + userMetadata.role.slice(1);
    const { reaction } = useReaction(userMetadata.user_id);

    const videoContainerStyles = useMemo(() => {
      return [
        styles.videoContainer,
        {
          minWidth: normalize(size),
          minHeight: normalize(size),
        },
        borderStyles,
      ];
    }, [size, borderStyles]);

    const border = useMemo(() => {
      return [styles.isSpeaking, { minWidth: normalize(size), minHeight: normalize(size) }, borderStyles];
    }, [size, borderStyles]);

    return (
      <View style={style}>
        <View style={videoContainerStyles}>
          <VideoView style={styles.video} videoTrack={cameraPublication?.videoTrack} mirror={true} />
          {reaction && (
            <>
              <Text style={styles.emoji}>{reaction}</Text>
            </>
          )}
          <BlurView style={styles.name}>
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Flex flexDirection='row' alignItems='center' gap={2}>
                {userMetadata.verified && <VerifiedIcon />}
                <Typography type='body' size='semibold'>
                  {userMetadata.user_first_name}
                </Typography>
              </Flex>
              <Typography type='body' size='default'>
                {displayRole}
              </Typography>
            </Flex>
          </BlurView>
        </View>
        {participant.isSpeaking && <View style={border} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    position: 'relative',
  },
  videoContainer: {
    overflow: 'hidden',
  },

  video: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },

  name: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'center',
    bottom: 4,
  },

  isSpeaking: {
    position: 'absolute',
    flex: 1,
    borderWidth: 1.5,
    borderColor: colorPalette.primary400,
    borderTopLeftRadius: 30,
    borderRadius: 8,
  },
  emoji: {
    fontSize: normalize(33),
    color: 'white',
    position: 'absolute',
    right: 4,
    top: 4,
  },
});
