import { StyleProp, ViewStyle } from 'react-native';
import { User } from '~/entities/User';

export type ChannelUsersListProps = {
  style?: StyleProp<ViewStyle>;
  type: 'admin' | 'leader';
  name: string;
  users: User[];
  defaultSearch?: string;
  onSendRequest?: (id: string) => void;
  onCancelRequest?: (id: string) => void;
  onRemoveUser?: (id: string) => void;
};
