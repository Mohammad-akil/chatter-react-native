import { type FC, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, StyleSheet, View, Dimensions } from 'react-native';
import { FadeIn, LinearTransition } from 'react-native-reanimated';
import { commonStyles } from '~/styles';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { VideoView, useParticipant } from '@livekit/react-native';
import Video from 'react-native-video';
import { UserMetadata } from '~/entities/User';
import { useStorageUser } from '~/services/mmkv/auth';
import { colorPalette, colors } from '~/styles/colors';
import ChatterIcon from '~/ui/ChatterIcon';
import { useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';

type StreamSectionProps = {
  style?: StyleProp<ViewStyle>;
};

const LivekitStreamView: FC<StreamSectionProps> = ({ style }) => {
  const { t } = useTranslation();
  const [user] = useStorageUser();

  const room = useRecoilValue(state.roomState);
  const livekitStreamingParticipant = useRecoilValue(state.livekitStreamingParticipantState);

  const participant = livekitStreamingParticipant ? livekitStreamingParticipant : room.livekitRoom.localParticipant;
  const parsedMetadata = JSON.parse(participant.metadata!) as UserMetadata;
  const { screenSharePublication } = useParticipant(participant);
  const streamOwner = useMemo(() => {
    return user?.id === parsedMetadata.user_id;
  }, [user?.id, parsedMetadata.user_id]);

  const videoContainerStyles = useMemo(() => {
    return {
      ...styles.videoContainer,
      height: streamOwner ? 200 : 500,
    };
  }, [streamOwner]);

  return (
    screenSharePublication?.videoTrack && (
      <AnimatedFlex layout={LinearTransition.duration(200)} entering={FadeIn.duration(200)} style={style} gap={16}>
        <Flex style={styles.title} flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={12}>
            <Typography type='headline' size='small'>
              {t('room.stream')}
            </Typography>
            <Typography type='label' size='small' color='warning300'>
              {parsedMetadata?.user_first_name} {t('room.isSharing')}
            </Typography>
          </Flex>
        </Flex>
        <View style={videoContainerStyles}>
          {streamOwner ? (
            <Flex gap={8} style={styles.streamOwner} alignItems='center' justifyContent='center' flex={1}>
              <ChatterIcon name='chatter-primary-logo' size={40} color={colorPalette.primary400} />
              <Typography type='label' size='small'>
                {t('room.screenshareActive')}
              </Typography>
            </Flex>
          ) : (
            <VideoView style={styles.video} videoTrack={screenSharePublication?.videoTrack} />
          )}
        </View>
      </AnimatedFlex>
    )
  );
};
const SocketStreamView: FC<StreamSectionProps> = ({ style }) => {
  const { t } = useTranslation();
  const socketStreamingParticipant = useRecoilValue(state.socketStreamingParticipantState);

  return (
    socketStreamingParticipant?.hls_url && (
      <AnimatedFlex layout={LinearTransition.duration(200)} entering={FadeIn.duration(200)} style={style} gap={16}>
        <Flex style={styles.title} flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={12}>
            <Typography type='headline' size='small'>
              {t('room.stream')}
            </Typography>
            <Typography type='label' size='small' color='warning300'>
              {socketStreamingParticipant?.user_first_name} is sharing
            </Typography>
          </Flex>
        </Flex>
        <View style={styles.videoContainer}>
          <Video style={styles.video} source={{ uri: socketStreamingParticipant?.hls_url }} />
        </View>
      </AnimatedFlex>
    )
  );
};

const StreamSection = () => {
  const currentRoomProvider = useRecoilValue(state.currentRoomProviderState);

  return currentRoomProvider === 'livekit' ? <LivekitStreamView /> : <SocketStreamView />;
};

export default memo(StreamSection);

const styles = StyleSheet.create({
  title: {
    paddingVertical: normalize(10),
    ...commonStyles.baseScreenPadding,
  },
  videoContainer: {
    width: Dimensions.get('screen').width - 40,
    height: 500,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 30,
  },
  video: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },

  streamOwner: {
    backgroundColor: colors.surface.surfaceComponent,
  },
});
