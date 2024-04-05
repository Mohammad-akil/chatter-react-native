import { useQuery } from '@tanstack/react-query';
import { api } from '~/api';

export const ROOM_REQUESTS_QUERY_KEY = 'roomservice/requests';

export const useRoomRequests = (room_id?: string) => {
  return useQuery({
    queryKey: [ROOM_REQUESTS_QUERY_KEY, room_id],
    queryFn: () => api.room.getRoomRequests(room_id!),
    enabled: !!room_id,
  });
};
