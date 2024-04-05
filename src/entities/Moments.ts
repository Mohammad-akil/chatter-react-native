import { ParticipantRole } from './Room';

export type EventSnapshot = {
  id: string;
  room_id: string;
  program_time: number;
  speaking: MomentSpeakingUser[] | null;
};

export type MomentSpeakingUser = {
  id: string;
  role: ParticipantRole;
  avatar: string | null;
  verified: boolean;
  username: string;
  last_name: string;
  first_name: string;
};
