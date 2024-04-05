import type { ObjectValues } from '../../types';
import type { NotificationGroup } from './constants';

export type Notification = {
  id: string;
  isRead: boolean;
  date: string;
} & NotificationVariantType;

export type NotificationGroup = ObjectValues<typeof NotificationGroup>;
export type NotificationCategory = {
  title: string;
  notifications: Notification[];
};

export type NotificationVariantType =
  | LiveRoomNotification
  | StartedFollowingNotification
  | ConversationResponseNotification
  | RoomInvitationNotification
  | RoomScheduledNotification
  | FollowingGroupNotification
  | RoomStartFollowingNotification;

export type LiveRoomNotification = {
  type: 'LIVE_ROOM';
  avatar: string;
  payload: {
    companyName: string;
    roomName: string;
    roomId: string;
    isJoined: boolean;
    companyId: string;
  };
};

export type StartedFollowingNotification = {
  type: 'STARTED_FOLLOWING';
  avatar: string;
  payload: {
    userName: string;
    userId: string;
    isFollowing: boolean;
  };
};

export type ConversationResponseNotification = {
  type: 'CONVERSATION_RESPONSE';
  avatar: string;
  payload: {
    userName: string;
    conversationName: string;
    userId: string;
    conversationId: string;
  };
};

export type RoomInvitationNotification = {
  type: 'ROOM_INVITATION';
  avatar: string;
  payload: {
    userName: string;
    roomName: string;
    userId: string;
    roomId: string;
    scheduleDate: string;
  };
};

export type RoomScheduledNotification = {
  type: 'ROOM_SCHEDULED';
  avatar: string;
  payload: {
    companyName: string;
    roomName: string;
    companyId: string;
    roomId: string;
    scheduleDate: string;
  };
};

export type RoomStartFollowingNotification = {
  type: 'ROOM_START_FOLLOWING';
  payload: {
    host: {
      id: string;
      avatar: string;
      username: string;
      last_name: string;
      first_name: string;
    };
    roomId: string;
    isJoined: boolean;
    roomName: string;
  };
};

export type FollowingGroupNotification = {
  type: 'FOLLOWING_GROUP';
  avatar?: never;
  payload: {
    userIds: string[];
    userNames: string[];
    avatars: string[];
    mainUserName: string;
    mainUserId: string;
    mainAvatar: string;
  };
};
