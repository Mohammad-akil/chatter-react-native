export type RecordingStatus = 'unrecorded' | 'recorded' | 'recording' | 'playing' | 'paused' | 'finished';

export interface AudioTypes {
  audio: { uri: string; name: string; type: string };
}
