import { atom } from 'recoil';
import { Channel } from '~/entities/Channel';

export const channelState = atom<Channel>({
  key: 'Channel',
  default: {
    id: '',
    name: '',
    admins: [],
    leaders: [],
    members: '0',
    description: '',
    audioDescription: '',
    owner: { first_name: '', id: '', last_name: '', username: '' },
    avatar: '',
    banner: '',
    follower_count: 0,
  },
});

export const imageModal = atom<boolean>({
  key: 'imageModalIsOpen',
  default: false,
});

export const typeOfUploadImage = atom<'avatar' | 'banner'>({
  key: 'typeOfUploadImage',
  default: 'avatar',
});

export const channelWasCreated = atom<boolean>({
  key: 'channelWasCreated',
  default: false,
});
export const channelId = atom<string>({
  key: 'selectedChannelId',
  default: '',
});
