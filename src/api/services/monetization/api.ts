import axios, { AxiosError } from 'axios';
import axiosApi from '~/api/config/axios';
import { authApi } from '../auth/api';

import { getError } from '~/api/config/getError';

async function getWidget() {
  try {
    const response = await axiosApi.get(`/monetization/onboarding-widget`);
    return response.data;
  } catch (e: any) {
    console.log(e.respose.data);
  }
}

export const monetizationApi = {
  getWidget,
};
