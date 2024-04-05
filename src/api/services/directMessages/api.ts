import axiosApi from '~/api/config/axios';
import { getError, getErrorOld } from '~/api/config/getError';
import { APIFunctionReturn } from '~/api/config/types';
import { ConversationType, Message, MessageType } from '~/entities/DirectMessages';

async function getConversations(): Promise<APIFunctionReturn<ConversationType[]>> {
  try {
    const response = await axiosApi.get(`dms/getUsersDMBoxes`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function getDmPersons(box_id: string) {
  try {
    const response = await axiosApi.get(`/dms/boxPersons/${box_id}`);
    return response.data;
  } catch (e) {
    return;
  }
}

async function deleteConversation(id: string) {
  try {
    const response = await axiosApi.delete<ConversationType[]>(`/dms/deleteBox/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function createConversation(idsArr: string[]): Promise<
  APIFunctionReturn<{
    created: string;
    id: string;
    owner_id: string;
    users: { avatar: string; first_name: string; id: string; last_name: string; username: string }[];
  }>
> {
  try {
    const response = await axiosApi.post(`/dms/createDirectMessageBox`, {
      userIds: idsArr,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function getConversationMessagesHistory(conversationId: string): Promise<APIFunctionReturn<Message[]>> {
  try {
    const response = await axiosApi.get(`/dms/getUsersDMBox/${conversationId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function createDirectMessage(
  boxId: string,
  content: any,
  type: MessageType,
): Promise<APIFunctionReturn<Message>> {
  const headers: { [key: string]: string } = {
    'x-box-id': boxId,
    'x-type': type,
  };

  let requestData;

  if (type === 'text') {
    requestData = { content };
  } else if (type === 'gif') {
    requestData = content;
  } else if (type === 'image' || type === 'imageText') {
    requestData = content;
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    throw new Error('Invalid message type');
  }
  try {
    const response = await axiosApi.post(`/dms/createDirectMessage`, requestData, {
      headers,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function deleteDirectMessage(id: string | undefined) {
  try {
    const response = await axiosApi.delete<Message[]>(`/dms/deleteMessageForMe/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

export const directMessagesApi = {
  getConversations,
  createConversation,
  getConversationMessagesHistory,
  createDirectMessage,
  deleteConversation,
  deleteDirectMessage,
  getDmPersons,
};
