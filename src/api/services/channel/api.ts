import axios, { AxiosError } from 'axios';
import axiosApi from '~/api/config/axios';
import { authApi } from '../auth/api';

import { getError } from '~/api/config/getError';
import { GetChannelResponse } from './types';

async function listChannels() {
  try {
    const response = await axiosApi.get(`/channel/channel_list`);
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function createChannel(name: string, description: string) {
  try {
    const response = await axiosApi.post(`/channel/create`, {
      name,
      description,
    });
    await authApi.me();
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function getChannel(id: string) {
  try {
    const response = await axiosApi.get<GetChannelResponse>(`/channel/${id}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function editChannel(id: string, name?: string, description?: string) {
  try {
    const response = await axiosApi.post(`/channel/update/${id}`, {
      name,
      description,
    });
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function uploadAvatarOrBanner(channelId: string, data: FormData) {
  try {
    const response = await axiosApi.post(`/channel/upload-image/${channelId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (e) {
    const error = e as Error | AxiosError;
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: error.message };
    }
  }
}

async function deleteAvatarOrBanner(channelId: string, type: string) {
  try {
    const response = await axiosApi.delete(`channel/delete-image/${channelId}`, {
      params: {
        type,
      },
    });
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function followChannel(channelId: string) {
  try {
    const response = await axiosApi.post(`followingChannel/follow-channel/${channelId}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function unfollowChannel(channelId: string) {
  try {
    const response = await axiosApi.delete(`followingChannel/unfollow/${channelId}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function uploadAudioDescription(channelId: string, formData: FormData) {
  try {
    const response = await axiosApi.put(`/channel/upload-audio-description/${channelId}`, formData, {
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

export const channelApi = {
  listChannels,
  createChannel,
  getChannel,
  editChannel,
  uploadAvatarOrBanner,
  deleteAvatarOrBanner,
  followChannel,
  unfollowChannel,
  uploadAudioDescription,
};
