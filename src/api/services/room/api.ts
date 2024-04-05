import axiosApi from '../../config/axios';
import {
  CreatRoomPollPayload,
  CreateContributionPayload,
  CreateRoomPayload,
  CreateRoomResponse,
  HandleRoomRequestPayload,
  JoinRoomResponse,
  MakeRoomRequestPayload,
  VoteInPollResponse,
} from './types';
import { APIFunctionReturn } from '~/api/config/types';
import { getError, getErrorOld } from '~/api/config/getError';
import {
  ListenerParticipant,
  PinnedLink,
  Poll,
  RemovedUser,
  Room,
  RoomRequest,
  StageParticipant,
} from '~/entities/Room';

async function joinRoom(room_id: string) {
  try {
    const response = await axiosApi.post<JoinRoomResponse>(`/rooms/${room_id}/join`);

    if (!response.data.authorized) {
      throw new Error(response.data.error.message);
    }

    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function endRoom(room_id: string): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post<any>(`/rooms/${room_id}/end`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function sendReaction(room_id: string, reaction: string): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post(`/roomservice/send-reaction`, { room_id, reaction });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function inviteToSpeak(payload: { room_id: string; user_id: string }): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post('/roomservice/invite-to-speak', payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function respondToInviteToSpeak(payload: {
  invite_id: string;
  accepted: boolean;
}): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post('/roomservice/respond-to-invite', payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function getRooms(): Promise<APIFunctionReturn<Room[]>> {
  try {
    const response = await axiosApi.get<Room[]>(`/rooms/list`);
    return { success: true, data: response.data };
  } catch (error) {
    return getErrorOld(error);
  }
}

async function makeRoomRequest(payload: MakeRoomRequestPayload): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post<any, any, MakeRoomRequestPayload>(`/roomservice/request`, payload);
    return { success: true, data: response.data };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function removeUser(payload: { room_id: string; user_id: string }): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post<any, any, { room_id: string; user_id: string }>(
      `/roomservice/remove-user`,
      payload,
    );
    return { success: true, data: response.data };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function reAllowRemovedUser(removal_id: string) {
  try {
    const response = await axiosApi.post<any, any, { removal_id: string }>(`/roomservice/update-remove-user`, {
      removal_id,
    });

    return { success: true, data: response.data };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function getRemovedUsers(room_id: string) {
  try {
    const response = await axiosApi.get<RemovedUser[]>(`/roomservice/${room_id}/removed-users`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function moveToAudience(payload: { room_id: string; user_id: string }): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post<any, any, { room_id: string; user_id: string }>(
      `/roomservice/move-to-audience`,
      payload,
    );
    return { success: true, data: response.data };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function handleRoomRequest(payload: HandleRoomRequestPayload): Promise<APIFunctionReturn<any>> {
  try {
    const response = await axiosApi.post<any, any, HandleRoomRequestPayload>('/roomservice/handle-request', payload);
    return { success: true, data: response.data };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function getRoomListeners(id: string) {
  try {
    const response = await axiosApi.get<ListenerParticipant[]>(`/rooms/${id}/listeners`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getStageParticipants(room_id: string) {
  try {
    const response = await axiosApi.get<StageParticipant[]>(`/rooms/${room_id}/stage-participants`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getRoomRequests(room_id: string) {
  try {
    const response = await axiosApi.get<RoomRequest[]>(`/roomservice/${room_id}/requests`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function createRoom(payload: CreateRoomPayload): Promise<APIFunctionReturn<CreateRoomResponse>> {
  try {
    const response = await axiosApi.post<CreateRoomResponse, any, CreateRoomPayload>(`/rooms/create`, payload);

    return { success: true, data: response.data };
  } catch (error) {
    return getErrorOld(error);
  }
}

async function getRoomDetails(id: string) {
  try {
    const response = await axiosApi.get<Room>(`/rooms/${id}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function createRoomPoll(payload: CreatRoomPollPayload) {
  try {
    const response = await axiosApi.post('/roomservice/create-poll', payload);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getRoomPoll(id: string) {
  try {
    const response = await axiosApi.get<Poll>(`roomservice/poll/${id}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function endRoomPoll(id: string) {
  try {
    const response = await axiosApi.post(`roomservice/poll/${id}/end`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function voteInPoll(payload: { poll_id: string; option: number }) {
  try {
    const response = await axiosApi.post<VoteInPollResponse>(`roomservice/create-poll-vote`, payload);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getPinnedLinks(room_id: string) {
  try {
    const response = await axiosApi.get<PinnedLink[]>(`roomservice/${room_id}/pinned-links`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function createPinnedLink({ url, room }: { url: string; room: string | undefined }) {
  try {
    const response = await axiosApi.post<VoteInPollResponse>(`roomservice/pinned-links/create`, {
      url,
      room_id: room,
    });
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function deletePinnedLink(id: string) {
  try {
    const response = await axiosApi.delete(`/roomservice/pinned-links/${id}/delete`);
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function deletePinnedLinks(roomId: string) {
  try {
    const response = await axiosApi.delete(`/roomservice/${roomId}/pinned-links/delete`);
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function createContribution(payload: CreateContributionPayload) {
  try {
    const response = await axiosApi.post(`/contributions/create`, payload);
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

export const roomApi = {
  joinRoom,
  getRooms,
  makeRoomRequest,
  handleRoomRequest,
  getRoomRequests,
  getRoomListeners,
  getRoomDetails,
  removeUser,
  reAllowRemovedUser,
  inviteToSpeak,
  respondToInviteToSpeak,
  getRemovedUsers,
  moveToAudience,
  getStageParticipants,
  endRoom,
  createRoom,
  createRoomPoll,
  getRoomPoll,
  endRoomPoll,
  voteInPoll,
  sendReaction,
  getPinnedLinks,
  createPinnedLink,
  deletePinnedLink,
  deletePinnedLinks,
  createContribution,
};
