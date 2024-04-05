import { type FC, memo, useMemo, useRef } from 'react';
import { Platform, StyleSheet, TouchableHighlight } from 'react-native';
import { type LocalParticipant } from 'livekit-client';
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view';
import { useTranslation } from 'react-i18next';

import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { commonPopover } from '~/styles';
import { colorPalette, colors } from '~/styles/colors';

import { useVideoControl } from '../../hooks/useVideoControl';
import React from 'react';

import { ScreenCapturePickerView } from '@livekit/react-native-webrtc';

type VideoButtonProps = {
  localParticipant: LocalParticipant;
};

const VideoButton: FC<VideoButtonProps> = ({ localParticipant }) => {
  const screenCaptureRef = useRef(null);

  const {
    cameraEnabled,
    screenShareEnabled,
    openVideoOptions,
    toggleCamera,
    toggleScreenShare,
    toggleOptions,
    closeOptions,
  } = useVideoControl(localParticipant, screenCaptureRef);
  const { t } = useTranslation();

  const videoEnabled = useMemo(() => {
    return cameraEnabled || screenShareEnabled;
  }, [cameraEnabled, screenShareEnabled]);

  const videoIcon = useMemo(() => {
    return videoEnabled ? 'videocam' : 'videocam-off-outline';
  }, [videoEnabled]);

  const screenCapturePickerView = Platform.OS === 'ios' && <ScreenCapturePickerView ref={screenCaptureRef} />;

  return (
    <Popover
      isVisible={openVideoOptions}
      onRequestClose={closeOptions}
      arrowSize={commonPopover.arrow}
      popoverStyle={popover.base}
      backgroundStyle={commonPopover.noBackground}
      offset={4}
      from={
        <IconButton
          type='room-control'
          on={videoEnabled}
          active={videoEnabled}
          iconName={videoIcon}
          size='3xl'
          onPress={toggleOptions}
        />
      }
    >
      <Flex style={options.base}>
        <TouchableHighlight underlayColor={colors.surface.surfaceComponent} onPress={toggleCamera} style={options.item}>
          <Flex flex={1} gap={4} flexDirection='row'>
            <Icon
              name={`radio-button-${cameraEnabled ? 'on' : 'off'}-outline`}
              color={cameraEnabled ? colorPalette.primary400 : colors.text.textDefault}
              size={20}
            />
            <Typography numberOfLines={1}>{t('room.faceTimeCamera')}</Typography>
          </Flex>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={toggleScreenShare}
          style={options.item}
        >
          <Flex flex={1} gap={4} flexDirection='row'>
            <Icon
              size={20}
              name={`radio-button-${screenShareEnabled ? 'on' : 'off'}-outline`}
              color={screenShareEnabled ? colorPalette.primary400 : colors.text.textDefault}
            />
            <Typography numberOfLines={1}>{t('room.screenRecord')}</Typography>
          </Flex>
        </TouchableHighlight>
        {screenCapturePickerView}
      </Flex>
    </Popover>
  );
};

export default memo(VideoButton);

const popover = StyleSheet.create({
  base: {
    ...commonPopover.noBackground,
    transform: [{ translateX: -50 }],
  },
});

const options = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    alignSelf: 'baseline',
    borderRadius: 6,
  },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: normalize(12),
    flex: 1,
  },
});
