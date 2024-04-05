import axiosApi from '~/api/config/axios';
import { getError } from '~/api/config/getError';
import { SearchResponse } from './types';

async function search({ q }: { q: string }) {
  try {
    let url = '/search';

    if (q.length > 0) {
      url += `?q=${q}`;
    }

    const response = await axiosApi.get<SearchResponse>(url);
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

export const searchApi = {
  search,
};
