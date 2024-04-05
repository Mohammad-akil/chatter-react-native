import { ParticipantRole, Poll, Room, RoomOld } from '~/entities/Room';
import { Permissions } from '~/services/websocket/types/RoomServiceEvents';

export type CreateRoomOld = Pick<RoomOld, 'name' | 'description' | 'privacy' | 'started_at' | 'tags' | 'thumbnail'>;

export type CreateRoomPayload = Pick<Room, 'title' | 'description'> & {
  channel_id?: string;
};

export type CreateRoomResponse = {
  success: true;
  message: string;
  room: Room;
};

export type JoinRoomData = {
  authorized: true;
  media_node: string;
  hls_playlist_url: string;
  token: string;
  role: ParticipantRole;
};

export type JoinRoomResponse =
  | JoinRoomData
  | {
      authorized: false;
      error: {
        code: 'user_removed';
        message: string;
      };
    };

export type MakeRoomRequestPayload = {
  roomId: string;
  permissions: Permissions[];
};

export type HandleRoomRequestPayload = {
  request_id: string;
  approved: boolean;
};

export type CreatRoomPollPayload = {
  question: string;
  options: {
    option: number;
    text: string;
  }[];
  room_id: string;
};

export type VoteInPollResponse = Pick<Poll, 'results' | 'total_votes'>;

export type CreateContributionPayload = {
  tx_id: string;
  room_id: string;
  amount: number;
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'web';
  msg_content: string;
};
