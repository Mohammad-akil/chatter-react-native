import { atom } from 'recoil';

export const profileState = atom<{
  first_name?: string;
  last_name?: string;
  description?: string;
}>({
  key: 'Profile',
  default: {
    first_name: '',
    last_name: '',
    description: '',
  },
});
