import axiosApi from '../../config/axios';

import { client } from '~/services/websocket';
import { storage } from '~/services/mmkv';
import {
  CheckSocialProviderPayload,
  CheckSocialProviderResponse,
  GetIntentResponse,
  GetSMSDeliveryStatus,
  LoginPayload,
  LoginResponse,
  RegisterCompletePayload,
  RegisterCompleteResponse,
  RequestOTPPayload,
  RequestOTPResponse,
  UpdateIntentPayload,
  UpdateIntentResponse,
  ValidateOTPPayload,
  ValidateOTPResponse,
} from './types';

import { SocialLoginProvider } from '~/entities/SocialLogin';
import { getError } from '~/api/config/getError';
import { User } from '~/entities/User';

function logout() {
  storage.auth.clear(); // clear the user data and auth tokens
  client.disconnect(); // disconnect the websocket
}
let accessToken: string;

async function checkSocialProvider<T extends SocialLoginProvider>(provider: T, payload: CheckSocialProviderPayload<T>) {
  try {
    console.log('checkSocialProvider payload:', { provider, payload });
    const response = await axiosApi.post<CheckSocialProviderResponse<typeof provider>>(
      '/register/validate-social-provider',
      {
        provider,
        payload,
      },
    );
    console.log('checkSocialProvider response:', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function login<T extends 'email' | SocialLoginProvider>(provider: T, payload: LoginPayload<T>) {
  const response = await axiosApi.post<LoginResponse>(`/auth/login`, {
    provider,
    payload,
  });
  const { access_token: accessToken, refresh_token: refreshToken, error } = response.data;
  storage.auth.setUserTokens({ accessToken, refreshToken });
  if (!error) {
    return response.data;
  }
  return { error: { code: 'INVALID_CREDENTIALS', msg: error } };
}

async function registerComplete(payload: RegisterCompletePayload) {
  try {
    console.log('REGISTER COMPLETE PAYLOAD:', payload);
    const response = await axiosApi.post<RegisterCompleteResponse>('/register/complete', payload);

    const { access_token: accessToken, refresh_token: refreshToken, error } = response.data;

    if (error) {
      return { error };
    }

    storage.auth.setUserTokens({ accessToken, refreshToken });
    me();
    console.log('REGISTER COMPLETE RESPONSE:', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function me() {
  try {
    const response = await axiosApi.get<User>('/auth/me', {});
    storage.auth.setUser(response.data);
    return response.data;
  } catch (e) {
    throw new Error(getError(e));
  }
}

async function refreshAccessToken() {
  const { refreshToken } = storage.auth.getUserTokens();
  const response = await axiosApi.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  const { access_token, refresh_token } = response.data;
  storage.auth.setUserTokens({ accessToken: access_token, refreshToken: refresh_token });
  return accessToken;
}

async function getIntent(client_type: 'ios' | 'android') {
  try {
    const response = await axiosApi.post<GetIntentResponse>('/register/intent', {
      client_type,
    });
    return response.data.intent;
  } catch (error) {
    console.log(error, 'getIntent error');
    // return { error: 'an error occured' };
  }
}

async function updateIntent(payload: UpdateIntentPayload) {
  try {
    const response = await axiosApi.post<UpdateIntentResponse>('/register/intent/update', payload);
    return response.data;
  } catch (error) {
    console.log(error, 'updateIntent error');
    // return { error: 'an error occured' };
  }
}

async function requestOTP(payload: RequestOTPPayload) {
  try {
    console.log('requestOTP payload:', payload);
    const response = await axiosApi.post<RequestOTPResponse>('/register/request-otp', payload);
    console.log('requestOTP response:', response.data);

    return response.data;
  } catch (error) {
    console.log(error, 'requestOTP error');
    // return { error: 'an error occured' };
  }
}

async function getSMSDeliveryStatus(sid: string) {
  try {
    console.log('getSMSDeliveryStatus payload:', sid);
    const response = await axiosApi.get<GetSMSDeliveryStatus>(`/register/sms-status/${sid}`);
    console.log('getSMSDeliveryStatus response:', response.data);
    return response.data;
  } catch (error) {
    console.log(error, 'getSMSDeliveryStatus error');
  }
}

async function validateOTP(payload: ValidateOTPPayload) {
  try {
    console.log('validateOTP payload:', payload);
    const response = await axiosApi.post<ValidateOTPResponse>('/register/validate-otp', payload);
    console.log('validateOTP response:', response.data);
    return response.data;
  } catch (error) {
    console.log(error, 'validateOTP error');
  }
}

async function checkUsernameExists(username: string) {
  try {
    const response = await axiosApi.post<{ available: boolean }>('/register/check-username', { username });
    return response.data;
  } catch (e) {
    const errorMessage = getError(e);
    throw new Error(errorMessage);
  }
}

export const authApi = {
  me,
  login,
  getIntent,
  updateIntent,
  requestOTP,
  validateOTP,
  getSMSDeliveryStatus,
  checkSocialProvider,
  registerComplete,
  checkUsernameExists,
  logout,
  refreshAccessToken,
};
