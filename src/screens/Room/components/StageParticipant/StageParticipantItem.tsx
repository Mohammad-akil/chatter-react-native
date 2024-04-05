import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import { ParticipantRole } from '~/entities/Room';

import Flex from '~/ui/Flex';
import VerifiedIcon from '~/ui/VerifiedIcon';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';

import SpeakingIndicator from './SpeakingIndicator';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { Participant, TrackPublication } from 'livekit-client';
import { useParticipant } from '@livekit/react-native';
import { UserMetadata } from '~/entities/User';
import { useReaction } from '../../hooks/useReaction';

function isTrackEnabled(pub?: TrackPublication): boolean {
  return !(pub?.isMuted ?? true);
}

type StageParticipantItemProps = {
  style?: StyleProp<ViewStyle>;
  user_id: string;
  role: ParticipantRole;
  avatar?: string | null;
  isMuted?: boolean;
  first_name: string;
  avatarSize?: number;
  isSpeaking: boolean;
  verified: boolean;
};

export const StageParticipantItem: FC<StageParticipantItemProps> = memo(
  ({ user_id, first_name, avatar, role, isSpeaking, isMuted, verified, style, avatarSize = 80 }) => {
    const { reaction } = useReaction(user_id);
    const displayRole = role[0].toUpperCase() + role.slice(1);
    return (
      <Flex style={[styles.base, style]} alignItems='center' gap={8}>
        <Flex alignItems='center' justifyContent='center'>
          <Flex alignItems='center' justifyContent='center'>
            <SpeakingIndicator size={avatarSize} isSpeaking={isSpeaking} />
            <Avatar url={avatar ?? null} size={avatarSize + 1} />
            {reaction && (
              <>
                <Animated.View entering={FadeIn} exiting={FadeOut} style={reactionWrapper.base}></Animated.View>
                <Text style={reactionWrapper.emoji}>{reaction}</Text>
              </>
            )}
          </Flex>

          {isMuted && (
            <Flex alignItems='center' justifyContent='center' style={styles.micIcon}>
              <Icon name='mic-off-outline' color={colorPalette.error400} size={16} />
            </Flex>
          )}
        </Flex>

        <Flex alignItems='center' gap={4}>
          <Flex flexDirection='row'>
            {verified && <VerifiedIcon style={styles.verifiedIcon} />}
            <Typography
              style={styles.displayName}
              numberOfLines={1}
              ellipsizeMode='tail'
              lineBreakMode='tail'
              type='body'
              size='semibold'
            >
              {first_name}
            </Typography>
          </Flex>
          <Typography type='body' size='small'>
            {displayRole}
          </Typography>
        </Flex>
      </Flex>
    );
  },
);

type LivekitStageParticipantItemProps = {
  participant: Participant;
};

export const LivekitStageParticipantItem: FC<LivekitStageParticipantItemProps> = memo(({ participant }) => {
  const { microphonePublication } = useParticipant(participant);
  const micEnabled = isTrackEnabled(microphonePublication);
  const userData: UserMetadata = JSON.parse(participant.metadata!);

  return (
    <StageParticipantItem
      user_id={userData.user_id}
      first_name={userData.user_first_name}
      avatar={userData.user_avatar}
      role={userData.role}
      verified={userData.verified}
      isMuted={!micEnabled}
      isSpeaking={participant.isSpeaking}
      //@ts-ignore
      reaction={participant.reaction}
    />
  );
});

const styles = StyleSheet.create({
  base: {
    width: normalize((Dimensions.get('window').width - 40) / 3),
    paddingTop: 3,
  },
  displayName: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  verifiedIcon: {
    position: 'absolute',
    left: normalize(-18),
  },

  micIcon: {
    padding: 2,
    position: 'absolute',
    right: 0,
    backgroundColor: colors.surface.surfacePrimary,
    borderRadius: 360,
    bottom: 0,
  },
});

const reactionWrapper = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 360,
    backgroundColor: '#00000080',
  },
  emoji: {
    fontSize: normalize(33),
    color: 'white',
    position: 'absolute',
  },
});
