interface BaseConversationTypes {
  created: string;
  id: string;
  status: string;
  title: string;
}

export interface NewConversationTypes extends BaseConversationTypes {
  audio_message: string;
  caption_url: string;
  duration: string;
  image: null | string;
  link: null | Link;
  reply_restriction: ReplyRestriction;
  updatedAt: string;
}

export interface Link {
  description: string | undefined;
  image: string | undefined;
  link: string | undefined;
  title: string | undefined;
}

export enum ReplyRestriction {
  All = 'all',
  Followers = 'followers',
  None = 'none',
}

export interface ConversationContent {
  content: {
    audio_message: string;
    link: Link | null;
    image: string | null;
  };
  duration: string;
  id: string;
  user: OwnerInfoTypes;
  caption_url: string;
}

export interface OwnerInfoTypes {
  avatar: string | null;
  first_name: string;
  id: string;
  last_name: string;
  username: string;
}

export interface ReadyConversationTypes extends BaseConversationTypes {
  content: ConversationContent[];
}

export interface ReplyCreateTypes {
  caption_url: string;
  content: ConversationContent[];
  conversation_id: string;
  created: string;
  duration: string;
  id: string;
  user: OwnerInfoTypes;
  user_id: string;
}

export interface ConversationViewTypes extends BaseConversationTypes {
  content: ConversationContent[];
  like: boolean;
  likes: string;
  nextConversationId: null | string;
  previousConversationId: null | string;
  reply_restriction: string;
  updated: string;
  views: string;
}
export interface GeneralConversationResponse {
  message: string;
  success: boolean;
}
