import axiosApi from '~/api/config/axios';
import { authApi } from '../auth/api';
import axios, { AxiosError } from 'axios';

import { getError, getErrorOld } from '~/api/config/getError';
import { GetProfileResponse } from './types';

async function getProfile(id: string) {
  try {
    const response = await axiosApi.get<GetProfileResponse>(`/users/${id}`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getAllProfiles() {
  try {
    const response = await axiosApi.get(`/users/all`);
    return {
      success: true,
      data: response.data,
    };
  } catch (e) {
    return getErrorOld(e);
  }
}

async function editProfile(payload: { first_name?: string; last_name?: string; profile_description?: string }) {
  try {
    const response = await axiosApi.put(`/users/update`, payload);
    await authApi.me();
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function deleteAvatar() {
  try {
    const response = await axiosApi.delete(`/users/delete-avatar`);
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

async function uploadAvatar(data: FormData) {
  try {
    const response = await axiosApi.put(`/users/upload-image`, data, {
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

async function followUser(payload: { followee_id: string }) {
  try {
    const response = await axiosApi.post('/following/follow', payload);
    await axiosApi.get('auth/me');
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function unfollowUser(followee_id: string) {
  try {
    const response = await axiosApi.delete(`/following/unfollow/${followee_id}`);
    await axiosApi.get('auth/me');
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getUserFollowing() {
  try {
    const response = await axiosApi.get(`/following/following_list`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getFollowingByUserId(userId: string) {
  try {
    const response = await axiosApi.get(`/following/${userId}/following`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getFollowersByUserId(userId: string) {
  try {
    const response = await axiosApi.get(`/following/${userId}/followers`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getFollowingList() {
  try {
    const response = await axiosApi.get(`/following/following_list`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function deleteAudioDescription() {
  try {
    const response = await axiosApi.delete(`/users/delete-audio-description`);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function uploadAudioDescription(formData: FormData) {
  try {
    const response = await axiosApi.put(`/users/upload-audio-description`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}
async function addSocialLink(provider: string, code: string, accessToken: string) {
  try {
    const response = await axiosApi.post('/users/add-social-link', {
      provider,
      code,
      accessToken,
    });
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}
export const profileApi = {
  editProfile,
  getProfile,
  uploadAvatar,
  deleteAvatar,
  getAllProfiles,
  followUser,
  unfollowUser,
  getUserFollowing,
  getFollowingByUserId,
  getFollowersByUserId,
  deleteAudioDescription,
  uploadAudioDescription,
  getFollowingList,
  addSocialLink,
};
