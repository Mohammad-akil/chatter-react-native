import { useQuery } from '@tanstack/react-query';
import { api } from '~/api';
import { PinnedLink } from '~/entities/Room';

export const PINNED_LINKS_QUERY_KEY = 'roomservice/pinned-links';

export const usePinnedLinks = (room_id?: string, initialData?: PinnedLink[]) => {
  return useQuery({
    queryKey: [PINNED_LINKS_QUERY_KEY, room_id],
    queryFn: () => api.room.getPinnedLinks(room_id!),
    enabled: !!room_id,
    initialData: initialData,
  });
};
