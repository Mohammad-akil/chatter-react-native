import { atom } from 'recoil';
import { SuggestedUsersResponse } from '~/api/services/community/types';

export const suggestedFromContactsState = atom<SuggestedUsersResponse[]>({
  key: 'usersFromContacts',
  default: [],
});
