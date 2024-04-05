import { useEffect, useRef, useState } from 'react';
import { client } from '~/services/websocket';
import { RoomServiceEvents, RoomServiceOnEvents } from '~/services/websocket/types/RoomServiceEvents';

export const useReaction = (user_id: string) => {
  const [reaction, setReaction] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleReaction: RoomServiceOnEvents[RoomServiceEvents.REACTION] = (response) => {
      if (response.payload.user_id === user_id) {
        setReaction(response.payload.reaction);
      }
    };

    client.on(RoomServiceEvents.REACTION, handleReaction);

    return () => {
      client.off(RoomServiceEvents.REACTION, handleReaction);
    };
  }, [user_id]);

  useEffect(() => {
    if (reaction) {
      timeoutRef.current = setTimeout(() => {
        setReaction(null);
      }, 3000);
    }

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [reaction]);

  return {
    reaction,
  };
};
