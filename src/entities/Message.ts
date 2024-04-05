import { User } from './User';

type MessageUser = Pick<User, 'id' | 'username' | 'avatar' | 'first_name' | 'last_name' | 'profile_description'> & {
  profile_socials: any[];
};

type TextContent = {
  id: string;
  text: string;
};

export type GifContent = {
  id: string;
  image: {
    url: string;
    title: string;
    height: string;
    width: string;
  };
};

type ContributionContent = {
  amount: number;
  text: string;
};

export type TextMessage = {
  id: string;
  room_id: string;
  created_at: string; // ISO STRING/
  user: MessageUser;
  removed: boolean;
  removed_by: any;
  type: 'text';
  content: TextContent;
};

export type GifMessage = {
  id: string;
  room_id: string;
  created_at: string; // ISO STRING/
  user: MessageUser;
  removed: boolean;
  removed_by: any;
  type: 'gif';
  content: GifContent;
};

export type ContributionMessage = {
  id: string;
  room_id: string;
  created_at: string; // ISO STRING/
  user: MessageUser;
  removed: boolean;
  removed_by: any;
  type: 'contribution';
  content: ContributionContent;
};

export type RoomChatMessage = TextMessage | GifMessage | ContributionMessage;
