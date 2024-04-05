import axiosApi from '~/api/config/axios';
import { getError } from '~/api/config/getError';
import { NumbersData, SuggestedUsersResponse } from './types';

async function getUsersFromContacts(numbersData: NumbersData[]) {
  try {
    const response = await axiosApi.post<SuggestedUsersResponse[]>(`/users/contacts_users`, numbersData);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

async function getAccount(userId: string) {
  try {
    const response = await axiosApi.get<any>(`/users/${userId}`);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

export const communityApi = {
  getUsersFromContacts,
  getAccount,
};
