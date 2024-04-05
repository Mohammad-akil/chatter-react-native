import { User } from '~/entities/User';

export type RequestedUser = {
  id: string;
  status: 'request' | 'existing';
};

export type UserProps = {
  user: User;
  type: 'admin' | 'leader';
  request?: RequestedUser;
  onSendRequest?: (user: User) => void;
  onCancelRequest?: (user: User) => void;
  onRemoveUser?: (user: User) => void;
};
