import { useMMKVStorage } from 'react-native-mmkv-storage';
import { MMKV } from './config';
import { User } from '~/entities/User';

const USER_TOKENS_KEY = 'userTokens';
const USER_KEY = 'user';

type UserTokens = {
  accessToken?: string;
  refreshToken?: string;
};

function setUserTokens({ accessToken, refreshToken }: UserTokens) {
  MMKV.setMap(USER_TOKENS_KEY, { accessToken, refreshToken });
}

function getUserTokens() {
  const userTokens = MMKV.getMap<UserTokens>(USER_TOKENS_KEY);
  return userTokens;
}

function setUser(data: User) {
  MMKV.setMap(USER_KEY, data);
}

function getUser() {
  try {
    const userTokensString = MMKV.getMap<UserTokens>(USER_TOKENS_KEY);
    if (!userTokensString) {
      return null;
    }
  } catch {
    return null;
  }

  const user = MMKV.getMap<User>(USER_KEY);
  return user;
}

function clear() {
  MMKV.removeItem(USER_KEY);
  MMKV.removeItem(USER_TOKENS_KEY);
}

export const authStorage = {
  setUser,
  setUserTokens,
  getUserTokens,
  getUser,
  clear,
};

export const useStorageUser = () => {
  return useMMKVStorage<User>(USER_KEY, MMKV);
};

export const useStorageUserTokens = (defaultValue?: any) => {
  return useMMKVStorage<UserTokens>(USER_TOKENS_KEY, MMKV, defaultValue);
};
