import { User } from './User';

export interface Channel {
  avatar?: string;
  banner?: string;
  description: string;
  id: string;
  name: string;
  admins?: any;
  leaders?: any;
  members?: any;
  subscribers?: any;
  audioDescription?: any;
  follower_count: number;
  owner: Pick<User, 'id' | 'first_name' | 'last_name' | 'username'>;
}

export type ChannelProfile = Pick<
  Channel,
  'id' | 'name' | 'avatar' | 'banner' | 'description' | 'owner' | 'follower_count'
>;
