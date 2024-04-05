import { atom } from 'recoil';
import { ConversationType } from '~/entities/DirectMessages';

export const conversationsState = atom<ConversationType[]>({
  key: 'conversations',
  default: [],
});
