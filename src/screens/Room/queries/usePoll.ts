import { useQuery } from '@tanstack/react-query';
import { api } from '~/api';
import { Poll } from '~/entities/Room';

export const ROOM_POLL_QUERY_KEY = 'roomservice/room-poll';

export const usePoll = (poll_id?: string, initialData?: Poll) => {
  return useQuery({
    queryKey: [ROOM_POLL_QUERY_KEY, poll_id],
    queryFn: () => api.room.getRoomPoll(poll_id!),
    enabled: !!poll_id,
    initialData: initialData,
  });
};
