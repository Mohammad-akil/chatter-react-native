import { Channel } from '~/entities/Channel';
import { User } from '~/entities/User';

type SearchedUserResult = Pick<User, 'id' | 'username' | 'first_name' | 'last_name' | 'avatar' | 'verified'>;
type SearchedChannelResult = Pick<Channel, 'id' | 'name' | 'avatar'>;

export type SearchResponse = {
  users: SearchedUserResult[];
  channels: SearchedChannelResult[];
};
