import axiosApi from '~/api/config/axios';
import { getError } from '~/api/config/getError';
import {
  ConversationViewTypes,
  GeneralConversationResponse,
  NewConversationTypes,
  ReadyConversationTypes,
  ReplyCreateTypes,
} from '~/entities/Conversations';

async function createNewConversation(conversation: FormData) {
  try {
    const response = await axiosApi.post<NewConversationTypes>('/conversations/create', conversation, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function getConversationsList() {
  try {
    const response = await axiosApi.get<ReadyConversationTypes[]>('/conversations/list');
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function getConversationById(id: string) {
  try {
    const response = await axiosApi.post<ConversationViewTypes>(`conversations/${id}/view`, id);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function deleteReplyPart(id: string | undefined) {
  try {
    const response = await axiosApi.delete<GeneralConversationResponse>(`conversations/reply/${id}/delete`);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function deleteConversation(id: string | undefined) {
  try {
    const response = await axiosApi.delete<GeneralConversationResponse>(`conversations/${id}`);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function likeConversation(id: string) {
  try {
    const response = await axiosApi.post<GeneralConversationResponse>(`conversations/${id}/like`, id);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function removeLike(id: string) {
  try {
    const response = await axiosApi.delete<GeneralConversationResponse>(`conversations/${id}/delete-like`);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function addReplyToConversation(id: string | undefined, reply: FormData) {
  try {
    const response = await axiosApi.post<ReplyCreateTypes>(`/conversations/${id}/reply`, reply, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

export const conversationsApi = {
  createNewConversation,
  getConversationsList,
  getConversationById,
  likeConversation,
  removeLike,
  addReplyToConversation,
  deleteReplyPart,
  deleteConversation,
};
