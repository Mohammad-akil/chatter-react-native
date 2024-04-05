//@ts-nocheck
import { LocalParticipant, ParticipantEvent, Track } from 'livekit-client';
import { ParticipantPermission } from 'livekit-client/dist/src/proto/livekit_models_pb';
import { useEffect, useState } from 'react';
export function useLivekitParticipant(participant) {
  const [isAudioMuted, setAudioMuted] = useState(false);
  const [, setVideoMuted] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState(participant.connectionQuality);
  const [isSpeaking, setSpeaking] = useState(false);
  const [metadata, setMetadata] = useState();
  const [publications, setPublications] = useState([]);
  const [subscribedTracks, setSubscribedTracks] = useState([]);
  const [permissions, setPermissions] = useState<ParticipantPermission>(participant.permissions);
  const [cameraPublication, setCameraPublication] = useState(participant.getTrack(Track.Source.Camera));
  const [microphonePublication, setMicrophonePublication] = useState(participant.getTrack(Track.Source.Microphone));
  const [screenSharePublication, setScreenSharePublication] = useState(participant.getTrack(Track.Source.ScreenShare));
  useEffect(() => {
    const onPublicationsChanged = () => {
      setPublications(Array.from(participant.tracks.values()));
      setCameraPublication(participant.getTrack(Track.Source.Camera));
      setMicrophonePublication(participant.getTrack(Track.Source.Microphone));
      setScreenSharePublication(participant.getTrack(Track.Source.ScreenShare));
      setSubscribedTracks(
        Array.from(participant.tracks.values()).filter((pub) => {
          return pub.isSubscribed && pub.track !== undefined;
        }),
      );
    };

    const onMuted = (pub) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(true);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(true);
      }
    };

    const onUnmuted = (pub) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(false);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(false);
      }
    };

    const onMetadataChanged = () => {
      if (participant.metadata) {
        setMetadata(participant.metadata);
      }
    };

    const onIsSpeakingChanged = () => {
      setSpeaking(participant.isSpeaking);
    };

    const onPermissionsChanged = () => {
      setPermissions({ ...participant.permissions });
    };

    const onConnectionQualityUpdate = () => {
      setConnectionQuality(participant.connectionQuality);
    }; // register listeners

    participant
      .on(ParticipantEvent.TrackMuted, onMuted)
      .on(ParticipantEvent.TrackUnmuted, onUnmuted)
      .on(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged)
      .on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
      .on(ParticipantEvent.TrackPublished, onPublicationsChanged)
      .on(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
      .on(ParticipantEvent.ParticipantPermissionsChanged, onPermissionsChanged)
      .on(ParticipantEvent.TrackSubscribed, onPublicationsChanged)
      .on(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged)
      .on(ParticipantEvent.LocalTrackPublished, onPublicationsChanged)
      .on(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged)
      .on(ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate); // set initial state

    onMetadataChanged();
    onIsSpeakingChanged();
    onPublicationsChanged();
    return () => {
      // cleanup
      participant
        .off(ParticipantEvent.TrackMuted, onMuted)
        .off(ParticipantEvent.TrackUnmuted, onUnmuted)
        .off(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged)
        .off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
        .off(ParticipantEvent.TrackPublished, onPublicationsChanged)
        .off(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
        .off(ParticipantEvent.ParticipantPermissionsChanged, onPermissionsChanged)
        .off(ParticipantEvent.TrackSubscribed, onPublicationsChanged)
        .off(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged)
        .off(ParticipantEvent.LocalTrackPublished, onPublicationsChanged)
        .off(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged)
        .off(ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);
    };
  }, [participant]);
  let muted;
  participant.audioTracks.forEach((pub) => {
    muted = pub.isMuted;
  });

  if (muted === undefined) {
    muted = true;
  }

  if (isAudioMuted !== muted) {
    setAudioMuted(muted);
  }

  return {
    isLocal: participant instanceof LocalParticipant,
    permissions: permissions,
    isSpeaking,
    connectionQuality,
    publications,
    subscribedTracks,
    cameraPublication,
    microphonePublication,
    screenSharePublication,
    metadata,
  };
}
