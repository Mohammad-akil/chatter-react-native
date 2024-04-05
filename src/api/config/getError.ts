import axios, { AxiosError } from 'axios';
import { ErrorResponse } from './types';

export const getErrorOld = (e: unknown): ErrorResponse => {
  const error = e as Error | AxiosError;
  if (axios.isAxiosError(error)) {
    return { success: false, error: error.message };
  } else {
    return { success: false, error: error.message };
  }
};

export const getError = (e: unknown) => {
  const error = e as Error | AxiosError;
  return error.message;
};
