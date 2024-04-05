import { atom } from 'recoil';
import { z } from 'zod';
import { CreateRoomOld } from '~/api/services/room/types';

export const roomNameValidator = z.string().min(3);

export const roomState = atom<CreateRoomOld>({
  key: 'create_room',
  default: {
    name: '',
    description: '',
    privacy: 'open',
    started_at: undefined,
    tags: [],
    thumbnail: null,
  },
});

type RoomNameError = {
  message: string | null;
  triggered: boolean;
};

export const roomNameError = atom<RoomNameError>({
  key: 'created_room_errors',
  default: {
    message: null,
    triggered: false,
  },
});
