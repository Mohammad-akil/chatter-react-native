import { atom } from 'recoil';
import { CheckApplePayload, CheckGooglePayload } from '~/api/services/auth/types';
import { User } from '~/entities/User';

type SignUpState = Pick<User, 'email' | 'username' | 'first_name' | 'last_name'> & { password: string };

type SignUpProvider =
  | {
      provider: 'email';
      provider_payload: undefined;
    }
  | {
      provider: 'apple';
      provider_payload: CheckApplePayload;
    }
  | {
      provider: 'google';
      provider_payload: CheckGooglePayload;
    };

export const signUpProcessProvider = atom<SignUpProvider>({
  key: 'sign_up_process_provider',
  default: {
    provider: 'email',
    provider_payload: undefined,
  },
});

export const singUpProcessData = atom<SignUpState>({
  key: 'sign_up_process',
  default: {
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
  },
});

export const signUpProcessIntent = atom<{ id: string | null; hash: string | null }>({
  key: 'sign_up_process_intent',
  default: {
    id: null,
    hash: null,
  },
});
