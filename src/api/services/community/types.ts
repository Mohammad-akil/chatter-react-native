import { User } from '~/entities/User';

export type SuggestedUsersResponse = Pick<
  User,
  'id' | 'first_name' | 'last_name' | 'avatar' | 'phone_number' | 'username' | 'verified'
>;
export type NumbersData = {
  id?: string;
  label: string;
  number: string;
};
