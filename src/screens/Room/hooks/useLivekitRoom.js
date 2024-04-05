import { ConnectionState, RoomEvent, Track } from 'livekit-client';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { state } from '../state/roomState';

export function useLivekitRoom(room, options) {
  var _options$sortParticip;
  const [error] = useState();
  const [participants, setParticipants] = useState([]);
  const [participantsWithVideo, setParticipantsWithVideo] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const setActiveSpeakers = useSetRecoilState(state.activeSpeakersState);

  const sortFunc =
    (_options$sortParticip = options === null || options === void 0 ? void 0 : options.sortParticipants) !== null &&
    _options$sortParticip !== void 0
      ? _options$sortParticip
      : sortParticipants;

  const handleActiveSpeakers = useCallback(
    (speakers) => {
      const speakersMetadata = speakers.map((speaker) => {
        const userData = JSON.parse(speaker.metadata);
        return userData;
      });

      setActiveSpeakers([...speakersMetadata]);
    },
    [setActiveSpeakers],
  );

  useEffect(() => {
    const onParticipantsChanged = () => {
      const remotes = Array.from(room.remoteParticipants.values());
      const newParticipants = [room.localParticipant];
      newParticipants.push(...remotes);
      sortFunc(newParticipants, room.localParticipant);

      const _participants = [];
      const _participantsWithVideo = [];

      newParticipants.forEach((p) => {
        if (p.getTrackPublication(Track.Source.Camera)) {
          _participantsWithVideo.push(p);
        } else {
          _participants.push(p);
        }
      });

      setParticipants([..._participants]);
      setParticipantsWithVideo([..._participantsWithVideo]);
    };

    const onSubscribedTrackChanged = (track) => {
      // ordering may have changed, re-sort
      onParticipantsChanged();

      if (track && track.kind !== Track.Kind.Audio) {
        return;
      }

      const tracks = [];
      room.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((pub) => {
          if (pub.audioTrack) {
            tracks.push(pub.audioTrack);
          }
        });
      });
      setAudioTracks(tracks);
    };

    const onConnectionStateChanged = (state) => {
      if (state === ConnectionState.Connected) {
        onParticipantsChanged();
      }
    };

    room.once(RoomEvent.Disconnected, () => {
      room
        .off(RoomEvent.ParticipantConnected, onParticipantsChanged)
        .off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
        .off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
        .off(RoomEvent.ParticipantPermissionsChanged, onParticipantsChanged)
        .off(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
        .off(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
        .off(RoomEvent.LocalTrackPublished, onParticipantsChanged)
        .off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
        .off(RoomEvent.ParticipantMetadataChanged, onParticipantsChanged)
        .off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
        .off(RoomEvent.TrackUnpublished, onSubscribedTrackChanged)
        .off(RoomEvent.TrackPublished, onSubscribedTrackChanged)
        .off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged)
        .off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);
    });

    room.on(RoomEvent.Connected, () => {
      room
        .on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged)
        .on(RoomEvent.Reconnected, onParticipantsChanged)
        .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
        .on(RoomEvent.ParticipantPermissionsChanged, onParticipantsChanged)
        .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
        .on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
        .on(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
        .on(RoomEvent.ParticipantMetadataChanged, onParticipantsChanged)
        .on(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
        .on(RoomEvent.TrackUnpublished, onSubscribedTrackChanged)
        .on(RoomEvent.TrackPublished, onSubscribedTrackChanged)
        .on(RoomEvent.LocalTrackPublished, onParticipantsChanged)
        .on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged) // trigger a state change by re-sorting participants
        .on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
        .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakers);

      onSubscribedTrackChanged();
    });

    return () => {
      room.off(RoomEvent.Connected, () => {});
      room.disconnect();
    };
  }, [room, sortFunc, handleActiveSpeakers]);
  return {
    error,
    participants,
    participantsWithVideo,
    audioTracks,
  };
}
/**
 * Default sort for participants, it'll order participants by:
 * 1. dominant speaker (speaker with the loudest audio level)
 * 2. local participant
 * 3. other speakers that are recently active
 * 4. participants with video on
 * 5. by joinedAt
 */

function sortRole(a, b) {
  const userAMetadata = JSON.parse(a.metadata) || null;
  const userBMetadata = JSON.parse(b.metadata) || null;
  const roleOrder = { host: 1, 'co-host': 2, moderator: 3, speaker: 4 };
  return roleOrder[userAMetadata.role] - roleOrder[userBMetadata.role];
}

export function sortParticipants(participants, localParticipant) {
  participants.sort(sortRole);
}

// export function sortParticipants(participants, localParticipant) {
//   participants.sort((a, b) => {
//     var _a$joinedAt$getTime, _a$joinedAt, _b$joinedAt$getTime, _b$joinedAt;

//     // loudest speaker first
//     if (a.isSpeaking && b.isSpeaking) {
//       return b.audioLevel - a.audioLevel;
//     } // speaker goes first

//     if (a.isSpeaking !== b.isSpeaking) {
//       if (a.isSpeaking) {
//         return -1;
//       } else {
//         return 1;
//       }
//     } // last active speaker first

//     if (a.lastSpokeAt !== b.lastSpokeAt) {
//       var _a$lastSpokeAt$getTim, _a$lastSpokeAt, _b$lastSpokeAt$getTim, _b$lastSpokeAt;

//       const aLast =
//         (_a$lastSpokeAt$getTim =
//           (_a$lastSpokeAt = a.lastSpokeAt) === null || _a$lastSpokeAt === void 0
//             ? void 0
//             : _a$lastSpokeAt.getTime()) !== null && _a$lastSpokeAt$getTim !== void 0
//           ? _a$lastSpokeAt$getTim
//           : 0;
//       const bLast =
//         (_b$lastSpokeAt$getTim =
//           (_b$lastSpokeAt = b.lastSpokeAt) === null || _b$lastSpokeAt === void 0
//             ? void 0
//             : _b$lastSpokeAt.getTime()) !== null && _b$lastSpokeAt$getTim !== void 0
//           ? _b$lastSpokeAt$getTim
//           : 0;
//       return bLast - aLast;
//     } // video on

//     const aVideo = a.videoTracks.size > 0;
//     const bVideo = b.videoTracks.size > 0;

//     if (aVideo !== bVideo) {
//       if (aVideo) {
//         return -1;
//       } else {
//         return 1;
//       }
//     } // joinedAt

//     return (
//       ((_a$joinedAt$getTime =
//         (_a$joinedAt = a.joinedAt) === null || _a$joinedAt === void 0 ? void 0 : _a$joinedAt.getTime()) !== null &&
//       _a$joinedAt$getTime !== void 0
//         ? _a$joinedAt$getTime
//         : 0) -
//       ((_b$joinedAt$getTime =
//         (_b$joinedAt = b.joinedAt) === null || _b$joinedAt === void 0 ? void 0 : _b$joinedAt.getTime()) !== null &&
//       _b$joinedAt$getTime !== void 0
//         ? _b$joinedAt$getTime
//         : 0)
//     );
//   });

//   if (localParticipant) {
//     const localIdx = participants.indexOf(localParticipant);

//     if (localIdx >= 0) {
//       participants.splice(localIdx, 1);

//       if (participants.length > 0) {
//         participants.splice(1, 0, localParticipant);
//       } else {
//         participants.push(localParticipant);
//       }
//     }
//   }
// }
