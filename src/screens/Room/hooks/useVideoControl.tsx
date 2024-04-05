import { useCallback, useEffect, useState } from 'react';
import { LocalTrackPublication, LocalParticipant, type TrackPublication, Track } from 'livekit-client';
import { useParticipant } from '@livekit/react-native';
import { NativeModules, Platform, findNodeHandle } from 'react-native';
import { startCallService, stopCallService } from '../components/RoomControls/callservice/CallService.android';
import { useRecoilState } from 'recoil';
import { state } from '../state/roomState';

const isTrackEnabled = (pub?: TrackPublication) => {
  return !(pub?.isMuted ?? true);
};

export const useCamera = (localParticipant: LocalParticipant) => {
  const [localTrackPublication, setLocalTrackPublication] = useRecoilState(state.localTrackPublicationState);

  const { cameraPublication } = useParticipant(localParticipant);
  const cameraEnabled = isTrackEnabled(cameraPublication);

  const toggleCamera = useCallback(async () => {
    if (localTrackPublication) {
      await localParticipant.unpublishTrack(localTrackPublication.track);
      setLocalTrackPublication(null);
    } else {
      const tracks = await localParticipant.createTracks({ video: true });
      const publishPromises: Promise<LocalTrackPublication>[] = [];
      for (const track of tracks) {
        if (track.source === Track.Source.Camera) {
          publishPromises.push(localParticipant.publishTrack(track));
        }
      }
      const publishedTracks = await Promise.all(publishPromises);
      const [track] = publishedTracks;
      setLocalTrackPublication(track);
    }
  }, [setLocalTrackPublication, localParticipant, localTrackPublication]);

  return {
    cameraEnabled: cameraEnabled,
    toggleCamera,
  };
};

export const useScreenShare = (localParticipant: LocalParticipant, screenCaptureRef: any) => {
  const { screenSharePublication } = useParticipant(localParticipant);
  const screenShareEnabled = isTrackEnabled(screenSharePublication);

  useEffect(() => {
    if (Platform.OS === 'android') {
      startCallService();
    }
    return () => {
      if (Platform.OS === 'android') {
        stopCallService();
      }
    };
  }, []);

  const startBroadcast = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const reactTag = findNodeHandle(screenCaptureRef.current);
      NativeModules.ScreenCapturePickerViewManager.show(reactTag);
      setTimeout(async () => {
        try {
          await localParticipant.setScreenShareEnabled(true);
        } catch (e) {
          console.log('Error setting screen share enabled');
        }
      }, 200);
    } else {
      localParticipant.setScreenShareEnabled(true);
    }
  }, [localParticipant, screenCaptureRef]);

  const stopBroadcast = useCallback(() => {
    if (Platform.OS === 'ios') {
      const reactTag = findNodeHandle(screenCaptureRef.current);
      NativeModules.ScreenCapturePickerViewManager.show(reactTag);
    } else {
      localParticipant.setScreenShareEnabled(false);
    }
  }, [localParticipant, screenCaptureRef]);

  return {
    screenCaptureRef,
    screenShareEnabled,
    startBroadcast,
    stopBroadcast,
  };
};

export const useVideoControl = (localParticipant: LocalParticipant, screenCaptureRef: any) => {
  const { cameraEnabled, toggleCamera } = useCamera(localParticipant);
  const { screenShareEnabled, startBroadcast, stopBroadcast } = useScreenShare(localParticipant, screenCaptureRef);

  const [openVideoOptions, setOpenVideoOptions] = useState(false);

  const closeOptions = useCallback(() => {
    setOpenVideoOptions(false);
  }, []);

  const toggleOptions = useCallback(() => {
    setOpenVideoOptions((prev) => !prev);
  }, []);

  const _toggleCamera = useCallback(() => {
    toggleCamera();
    closeOptions();
  }, [toggleCamera, closeOptions]);

  const toggleScreenShare = useCallback(() => {
    if (!screenShareEnabled) {
      startBroadcast();
    } else {
      stopBroadcast();
    }
    closeOptions();
  }, [screenShareEnabled, startBroadcast, stopBroadcast, closeOptions]);

  return {
    openVideoOptions,
    cameraEnabled,
    screenShareEnabled,
    toggleCamera: _toggleCamera,
    toggleScreenShare,
    toggleOptions,
    closeOptions,
  };
};
