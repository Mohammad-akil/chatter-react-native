import axiosApi from '~/api/config/axios';
import { getError } from '~/api/config/getError';
import { RoomChatMessage } from '~/entities/Message';

async function getRoomChatHistory(room_id: string) {
  try {
    const response = await axiosApi.get<RoomChatMessage[]>(`/chat/room/${room_id}/history`);
    return response.data;
  } catch (error) {
    throw new Error(getError(error));
  }
}

export const chatApi = {
  getRoomChatHistory,
};
