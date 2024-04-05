import { Permissions } from '~/services/websocket/types/RoomServiceEvents';
import { User, UserMetadata, users } from './User';
import { Participant } from 'livekit-client';

export type RoomAccess = 'network' | 'invite_only' | 'public' | 'ticketed';
export type RoomStatus = 'ended' | 'scheduled' | 'active';
export type RoomType = 'instant' | 'scheduled';

export type ParticipantRole = 'host' | 'listener' | 'speaker';
export type VideoType = 'screen' | 'camera';

export type ListenerParticipant = {
  id: string;
  client_id: string;
  node_id: string;
  joined_at?: string; // ISO STRING
  left_at?: string | null;
  user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar' | 'verified'>;
};

export type Track = {
  sid: string;
  muted: boolean;
  disableDtx: boolean;
  source: string;
  mimeType: string;
  mid: string;
  stereo: boolean;
  disableRed: boolean;
  stream: string;
  version: any;
};

export type Poll = {
  id: string;
  created_at: string;
  creator: Pick<User, 'id' | 'username' | 'avatar' | 'first_name' | 'last_name'>;
  question: string;
  options: PollOption[];
  results: PollOptionResult[];
  total_votes: number;
  user: {
    voted:
      | {
          voted: true;
          option: number;
        }
      | {
          voted: false;
          option: null;
        };
  };
};

export type PollOption = {
  text: string;
  option: number;
};

export type PollOptionResult = PollOption & {
  count: number;
};

export type StageParticipant = Pick<Participant, 'sid' | 'identity' | 'name' | 'isSpeaking'> & {
  tracks: Track[];
  joinedAt: number;
  metadata: UserMetadata;
  state: number;
  version: number;
  region: string;
  isPublisher: boolean;
  permissions: unknown;
  joinTime: string;
  isMuted: boolean;
  camera_url: string | null;
  screen_share_url: string | null;
};

export type RemovedUser = {
  id: string;
  created_at: string; // ISO STRING
  room_id: string;
  user_id: string;
  removed_by_id: string;
  user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
  removed_by: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
};

export type Room = {
  id: string;
  type: RoomType;
  access: RoomAccess;
  chat_enabled: boolean;
  created_at: string; // ISO STRING
  ended_at: string | null;
  recording_enabled: boolean;
  started_at: string | null; // ISO STRING
  thumbnail: string | null;
  title: string;
  owner_id: string;
  status: RoomStatus;
  invited_users: User[];
  scheduled_start_time: string | null; // ISO STRING
  description?: string | null;
  room_topics: any[];
  messages: number;
  subscribers: number;
  removed_users: RemovedUser[];
  active_poll: Poll | null;
} & {
  user_owned_room: true;
  host: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar' | 'verified'>;
  host_id: string;
};

export type RoomStatusOld = 'live' | 'upcoming' | 'past';
export type RoomPrivacyOld = 'open' | 'private' | 'subscribers';

export type RoomOld = {
  id: string;
  name: string;
  description?: string;
  messages: number;
  started_at?: string;
  ended_at: string | null;
  thumbnail?: string | null;
  status: RoomStatusOld;
  privacy: RoomPrivacyOld;
  channelName: string;
  channelAvatar?: string | null;
  channelSubscribers: number;
  users: User[];
  tags: string[];
};

export type RoomRequest = {
  id: string;
  created_at: string; // ISO string
  room_id: string;
  user_id: string;
  approved: boolean | null;
  permission: Permissions[];
  user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>;
};

export type Link = {
  url: string;
  title: string;
  domain: string;
  images: string[];
  favicon: string;
  durration: number;
  sitename: string;
  description: string;
  id: string;
  created_at: string;
};

export type PinnedLink = {
  link: Link;
  user: Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar'>;
};

export const roomLive: RoomOld = {
  id: '1',
  name: 'Deep Blue Dialogue: Saving Our Oceans',
  description: 'Let’s talk about ways we can save our marine life',
  channelName: 'Understanding our World',
  channelSubscribers: 1234,
  channelAvatar:
    'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  messages: 123,
  status: 'live',
  privacy: 'private',
  thumbnail:
    'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  ended_at: null,
  users: users,
  tags: ['Environment'],
};

export const roomUpcoming: RoomOld = {
  id: '1',
  name: 'Deep Blue Dialogue: Saving Our Oceans',
  description: 'Let’s talk about ways we can save our marine life',
  channelName: 'Understanding our World',
  channelSubscribers: 1234,
  channelAvatar:
    'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  messages: 123,
  status: 'upcoming',
  privacy: 'private',
  thumbnail:
    'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  started_at: new Date(2024, 0, 8, 20, 0, 0).toISOString(),
  ended_at: null,
  users: users,
  tags: [],
};

export const roomPast: RoomOld = {
  id: '1',
  name: 'Deep Blue Dialogue: Saving Our Oceans',
  description: 'Let’s talk about ways we can save our marine life',
  channelName: 'Understanding our World',
  channelSubscribers: 1234,
  channelAvatar:
    'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  messages: 123,
  status: 'past',
  privacy: 'private',
  thumbnail:
    'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  started_at: new Date(2024, 0, 3, 18, 1, 32).toISOString(),
  ended_at: new Date(2024, 0, 3, 20, 45, 32).toISOString(),
  users: users,
  tags: ['Environment'],
};
