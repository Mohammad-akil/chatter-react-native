import { authApi } from './services/auth/api';
import { roomApi } from './services/room/api';
import { notificationsApi } from './services/notifications/api';
import { chatApi } from './services/chat/api';
import { channelApi } from './services/channel/api';
import { profileApi } from './services/profile/api';
import { directMessagesApi } from './services/directMessages/api';
import { searchApi } from './services/search/api';
import { communityApi } from './services/community/api';
import { monetizationApi } from './services/monetization/api';
import { verificationApi } from './services/verification/api';
import { conversationsApi } from './services/conversations/api';
import { momentApi } from './services/moment/api';

export const api = {
  chat: chatApi,
  auth: authApi,
  room: roomApi,
  channel: channelApi,
  notifications: notificationsApi,
  profile: profileApi,
  directMessages: directMessagesApi,
  search: searchApi,
  community: communityApi,
  monetization: monetizationApi,
  verification: verificationApi,
  conversations: conversationsApi,
  moment: momentApi,
};
