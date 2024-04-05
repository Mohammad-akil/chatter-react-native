import { User } from './User';

export interface ConversationType {
  dmBoxId: string;
  boxUsers: Pick<User, 'avatar' | 'first_name' | 'last_name'>[];
  latestMessage: {
    content: any;
    created: string;
    type: string;
    sender: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username'> | null;
  };
}

export type MessageType = 'text' | 'image' | 'gif' | 'audio' | 'imageText';
export interface Message {
  id: string;
  dmbox_id: string;
  content: any;
  created: string;
  type: MessageType;
  sender: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username'>;
}

export interface Image {
  image: {
    uri?: string;
    name?: string;
    type?: string;
  };
  dimensions: {
    width?: number;
    height?: number;
  };
}
