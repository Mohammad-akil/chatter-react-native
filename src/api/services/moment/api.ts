import axios from 'axios';
import axiosApi from '~/api/config/axios';
import { getError } from '~/api/config/getError';
import { EventSnapshot } from '~/entities/Moments';
import { CreateMomentPayload, GenerateAudioResponse } from './types';

async function createMoment(payload: CreateMomentPayload) {
  try {
    const response = await axiosApi.post(`/moments/create`, payload);
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function generateAudio(room_id: string) {
  try {
    const response = await axios.get<GenerateAudioResponse>(
      'https://dev-moment-worker.chattersocial.io/generate-audio-preview',
      {
        params: {
          room_id: room_id,
        },
      },
    );
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function getMomentEvents(room_id: string, start: number, end: number) {
  try {
    const response = await axiosApi.get<EventSnapshot[]>('/moments/events', {
      params: {
        room_id,
        start,
        end,
      },
    });
    return response;
  } catch (e) {
    throw new Error(getError(e));
  }
}

export const momentApi = {
  createMoment,
  getMomentEvents,
  generateAudio,
};
