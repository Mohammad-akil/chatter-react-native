import { type FC, memo, useCallback, useEffect } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, SequencedTransition } from 'react-native-reanimated';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackPlayer from 'react-native-track-player';
import moment from 'moment';

import ScreenHeader from '~/components/ScreenHeader';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import { useClipMoment } from './useClipMoment';

import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

import { clipMomentState } from '../../state/clipMomentState';
import { state } from '../../state/roomState';

import MomentsParticipants from './MomentsParticipants';
import CreateMomentModal from '../../components/CreateMomentModal';

type ClipMomentProps = {
  style?: StyleProp<ViewStyle>;
};
function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}m${formattedSeconds}s`;
}

const CustomSliderLeft = () => {
  return (
    <View
      style={{
        width: normalize(28),
        height: normalize(32),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#30D6D9',
        top: '49.5%',
      }}
    >
      <Icon name='reorder-four-outline' size={normalize(20)} color={colorPalette.primary900} />
    </View>
  );
};

const CustomSliderRight = () => {
  return (
    <View
      style={{
        width: normalize(28),
        height: normalize(32),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#30D6D9',
        top: '49.5%',
      }}
    >
      <Icon name='reorder-four-outline' size={normalize(20)} color={colorPalette.primary900} />
    </View>
  );
};

const ClipMoment: FC<ClipMomentProps> = () => {
  const { goBack } = useNavigation();
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);
  const { width } = useWindowDimensions();

  const programStartTime = useRecoilValue(clipMomentState.programStartTimeState);
  const programEndTime = useRecoilValue(clipMomentState.programEndTimeState);

  const [createMomentModalOpened, setCreateMomentModalOpened] = useRecoilState(
    clipMomentState.createMomentModalOpenedState,
  );

  const {
    speakers,
    audioDuration,
    startPosition,
    endPosition,

    isPlaying,
    onSliderChange,
    handlePlayPause,
    createMoment,
  } = useClipMoment();

  const clearScreenState = useResetRecoilState(clipMomentState.screenState);
  const clearEventSnapshotsState = useResetRecoilState(clipMomentState.eventSnapshotsState);
  const clearCurrentEventSnapshotState = useResetRecoilState(clipMomentState.currentEventSnapshotState);
  const clearSpeakersState = useResetRecoilState(clipMomentState.speakersState);
  const clearProgramStartTimeState = useResetRecoilState(clipMomentState.programStartTimeState);
  const clearProgramEndTimeState = useResetRecoilState(clipMomentState.programEndTimeState);
  const clearAudioDurationState = useResetRecoilState(clipMomentState.audioDurationState);
  const clearCreateMomentModalOpenedState = useResetRecoilState(clipMomentState.createMomentModalOpenedState);

  useFocusEffect(
    useCallback(() => {
      return () => {
        TrackPlayer.reset();
        clearScreenState();
        clearEventSnapshotsState();
        clearCurrentEventSnapshotState();
        clearSpeakersState();
        clearAudioDurationState();
        clearProgramStartTimeState();
        clearProgramEndTimeState();
        clearCreateMomentModalOpenedState();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const openModal = useCallback(() => {
    setCreateMomentModalOpened(true);
  }, [setCreateMomentModalOpened]);

  const onGoBack = useCallback(() => {
    goBack();
    setRoomControlsOpened(true);
  }, [setRoomControlsOpened, goBack]);

  return (
    <SafeAreaView style={styles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton
        title='Clip moment'
        titleSize='medium'
        onBack={onGoBack}
      />
      <MomentsParticipants speakers={speakers} />
      <Animated.View
        layout={SequencedTransition.duration(100)}
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={clipMomentControls.base}
      >
        <Flex flex={1} alignItems='center' style={commonStyles.baseScreenPadding}>
          <MultiSlider
            min={0}
            max={programEndTime - programStartTime}
            values={[0, programEndTime - programStartTime]}
            vertical={false}
            isMarkersSeparated={true}
            customMarkerLeft={CustomSliderLeft}
            customMarkerRight={CustomSliderRight}
            enabledOne={true}
            enabledTwo={true}
            trackStyle={{
              height: normalize(32),
              borderRadius: 8,
              backgroundColor: colorPalette.grey600_50,
            }}
            selectedStyle={{ backgroundColor: colorPalette.primary600 }}
            sliderLength={width - 40}
            onValuesChange={onSliderChange}
          />
        </Flex>
        <Flex style={commonStyles.baseScreenPadding} justifyContent='space-between' flexDirection='row'>
          <Typography color='textSecondary'>{moment.utc(audioDuration * 1000).format('mm:ss')}</Typography>
          <Typography>{moment.utc((endPosition - startPosition) * 1000).format('mm:ss')}</Typography>
        </Flex>
        <Flex
          style={clipMomentControls.innerContainer}
          flexDirection='row'
          alignItems='baseline'
          justifyContent='center'
          gap={2}
        >
          {/* <IconButton type='secondary' size='3xl' iconName='download-outline' /> COMING STATE */}
          <IconButton type='secondary' size='3xl' iconName={isPlaying ? 'pause' : 'play'} onPress={handlePlayPause} />
          <IconButton type='primary' size='3xl' iconName='checkmark' onPress={openModal} />
        </Flex>
      </Animated.View>
      {/* <View
        style={{
          borderColor: 'white',
          backgroundColor: 'white',
          borderWidth: 1,
          minHeight: 100,
          position: 'absolute',
          bottom: 220,
          zIndex: 100,
        }}
      >
        <Text style={{ fontWeight: 'bold', paddingVertical: 4 }}>Debug Data:</Text>
        <Text style={{}}>
          Start Position: <Text style={{ color: '#30D6D9' }}>{startPosition}</Text> {'  '} Current Position:
          <Text style={{ color: '#30D6D9' }}> {formatSeconds(Math.round(currentPosition))}</Text>
        </Text>
        <Text style={{}}>
          End Position: <Text style={{ color: '#30D6D9' }}>{endPosition}</Text>
          {'  '} Calculated Moment Duration:{' '}
          <Text style={{ color: '#30D6D9' }}>{formatSeconds(endPosition - startPosition)}</Text>
        </Text>
      </View> */}
      {createMomentModalOpened && <CreateMomentModal createMoment={createMoment} />}
    </SafeAreaView>
  );
};

export default memo(ClipMoment);

const styles = StyleSheet.create({
  baseSafeArea: {
    flexGrow: 1,
    backgroundColor: colorPalette.grey850,
    // paddingBottom: Platform.OS === 'ios' ? normalize(100) : normalize(120),
  },
  scrollContent: {
    paddingHorizontal: normalize(20),
  },
  bodyContainer: {
    flex: 1,
    flexGrow: 1,
  },
});

const clipMomentControls = StyleSheet.create({
  base: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    pointerEvents: 'box-none',
    backgroundColor: colorPalette.grey850,
    bottom: 0,
    paddingTop: normalize(24),
    gap: normalize(12),
    zIndex: 4,
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    pointerEvents: 'box-none',
    paddingBottom: normalize(44),
  },
});
