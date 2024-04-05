import { useQuery } from '@tanstack/react-query';
import { api } from '~/api';

export const ROOM_REMOVED_USERS_QUERY_KEY = 'roomservice/removed-users';

export const useRemovedUsers = (room_id?: string) => {
  return useQuery({
    queryKey: [ROOM_REMOVED_USERS_QUERY_KEY, room_id],
    queryFn: () => api.room.getRemovedUsers(room_id!),
    enabled: !!room_id,
  });
};
