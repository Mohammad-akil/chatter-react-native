import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';

import { ListenerParticipant } from '~/entities/Room';
import VerifiedIcon from '~/ui/VerifiedIcon';
import { normalize } from '~/utils/normalize';
import { useReaction } from '../../hooks/useReaction';

type AudienceParticipantProps = {
  style?: StyleProp<ViewStyle>;
  listener: ListenerParticipant;
};

const AudienceParticipant: FC<AudienceParticipantProps> = ({ listener }) => {
  const { reaction } = useReaction(listener.user.id);

  return (
    <AnimatedFlex alignItems='center' gap={8} style={styles.base}>
      <Flex alignItems='center' justifyContent='center'>
        <Avatar url={listener.user.avatar ?? null} size={56} />
        {reaction && (
          <>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={reactionWrapper.base}></Animated.View>
            <Text style={reactionWrapper.emoji}>{reaction}</Text>
          </>
        )}
      </Flex>
      <Flex flexDirection='row'>
        {listener.user.verified && <VerifiedIcon style={styles.verifiedIcon} />}
        <Typography type='body' size='semibold'>
          {listener.user.first_name}
        </Typography>
      </Flex>
    </AnimatedFlex>
  );
};

export default memo(AudienceParticipant);

const styles = StyleSheet.create({
  base: {
    width: normalize((Dimensions.get('window').width - 40) / 4),
  },
  verifiedIcon: {
    position: 'absolute',
    left: normalize(-18),
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emoji: {
    fontSize: normalize(25),
    color: 'white',
    position: 'absolute',
  },
});
