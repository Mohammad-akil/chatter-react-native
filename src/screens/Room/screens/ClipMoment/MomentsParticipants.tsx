import { type FC, memo, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import { MomentSpeakingUser } from '~/entities/Moments';
import { clipMomentState } from '../../state/clipMomentState';
import Flex from '~/ui/Flex';
import { StageParticipantItem } from '../../components/StageParticipant/StageParticipantItem';
import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';

type MomentsParticipantsProps = {
  style?: StyleProp<ViewStyle>;
  speakers: MomentSpeakingUser[];
};

const getSizeStyle = (speakers_count: number): StyleProp<ViewStyle> => {
  if (speakers_count === 1) {
    return { width: normalize(360), height: normalize(360) };
  }
  if (speakers_count === 2) {
    return { width: normalize(170), height: normalize(360) };
  }
  return { width: normalize(170), height: normalize(170) };
};

const MomentsParticipants: FC<MomentsParticipantsProps> = ({ speakers }) => {
  const currentEventSnapshot = useRecoilValue(clipMomentState.currentEventSnapshotState);

  const addEmptyBlock = useMemo(() => {
    return speakers.length === 3;
  }, [speakers]);

  return (
    <Flex style={commonStyles.baseScreenPadding}>
      <Flex style={styles.base}>
        {speakers.map((user, index) => {
          const lastElement = index === speakers.length - 1;
          const avatarSize = speakers.length === 1 ? 120 : 80;

          const isSpeaking = !!currentEventSnapshot?.speaking?.find((frameUser) => frameUser.id === user.id);

          if (lastElement && addEmptyBlock) {
            return (
              <Flex flexDirection='row' alignItems='center' justifyContent='center' gap={4} key={user.id}>
                <Flex key={user.id} style={styles.item}>
                  <StageParticipantItem
                    user_id={user.id}
                    first_name={user.first_name}
                    avatar={user.avatar}
                    role={user.role}
                    verified={user.verified}
                    isSpeaking={isSpeaking}
                    isMuted={false}
                  />
                </Flex>
                <View style={styles.emptyBlock}></View>
              </Flex>
            );
          }

          return (
            <Flex key={user.id} style={[styles.item, getSizeStyle(speakers.length)]}>
              <StageParticipantItem
                user_id={user.id}
                first_name={user.first_name}
                avatar={user.avatar}
                role={user.role}
                verified={user.verified}
                avatarSize={avatarSize}
                isSpeaking={isSpeaking}
                isMuted={false}
              />
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default memo(MomentsParticipants);

const styles = StyleSheet.create({
  base: {
    width: normalize(360),
    height: normalize(360),
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 4,
  },
  item: {
    // backgroundColor: colors.surface.surfaceComponent,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(170),
    width: normalize(170),
    borderRadius: 8,
  },

  emptyBlock: {
    height: normalize(170),
    width: normalize(170),
  },
});
