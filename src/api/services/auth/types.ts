import { User } from '~/entities/User';
import { SocialLoginProvider } from '~/entities/SocialLogin';

// POST /auth/login ================================
type LoginWithEmailPayload = {
  email: string;
  password: string;
};

type LoginWithApplePayload = {
  token?: string | null;
  nonce?: string;
};

type LoginWithGooglePayload = {
  token: string;
};

export type LoginPayload<T extends 'email' | SocialLoginProvider> = T extends 'email'
  ? LoginWithEmailPayload
  : T extends 'google'
    ? LoginWithGooglePayload
    : T extends 'apple'
      ? LoginWithApplePayload
      : never;

export type LoginResponse =
  | {
      error: undefined;
      access_token: string;
      refresh_token: string;
    }
  | {
      error: string;
      access_token: undefined;
      refresh_token: undefined;
    };

// POST /register/validate-social-provider ================================

export type CheckGooglePayload = {
  accessToken: string;
  idToken: string;
};

export type CheckApplePayload = {
  code: string;
  id_token: string;
  nonce: string;
  state: string | null;
};

export type CheckSocialProviderPayload<T extends SocialLoginProvider> = T extends 'google'
  ? CheckGooglePayload
  : T extends 'apple'
    ? CheckApplePayload
    : never;

type AppleProviderResult = {
  iss?: string;
  aud?: string;
  exp: number;
  iat: number;
  sub?: string;
  nonce?: string;
  c_hash?: string;
  email?: string;
  email_verified?: string;
  auth_time: number;
  nonce_suported: boolean;
};

type GoogleProviderResult = {
  id: string;
  email: string;
  verified_email: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
};

export type CheckSocialProviderResponse<T extends SocialLoginProvider> =
  | {
      isChatterUser: true;
      user: Pick<
        User,
        | 'id'
        | 'email'
        | 'first_name'
        | 'last_name'
        | 'avatar'
        | 'username'
        | 'monetization_enabled'
        | 'pro_subscribed'
        | 'profile_audio_description'
        | 'profile_description'
        | 'online'
      >;
    }
  | {
      isChatterUser: false;
      provider_result: T extends 'google' ? GoogleProviderResult : T extends 'apple' ? AppleProviderResult : undefined;
      user: undefined;
    };

// POST /register/intent ================================
export type GetIntentResponse = {
  intent: {
    id: string;
    hash: string;
  };
  created: string;
};

// POST /register/intent/update =========================
export type UpdateIntentPayload = {
  intent_id: string;
  intent_hash: string;
  phone_number: string;
};

export type UpdateIntentResponse =
  | {
      success: true;
      error: never;
      message: string;
    }
  | {
      success: undefined;
      error: true;
      message: string;
    };

// POST /register/request-otp ============================
export type RequestOTPPayload = {
  intent_id: string;
  intent_hash: string;
};

export type RequestOTPResponse =
  | {
      success: true;
      status: 'queued';
      sms_event_id: string;
    }
  | {
      success: undefined;
      error: string;
      message: string;
      seconds_till: number;
    };

// GET /register/sms-status/${sid} =================
type MessageStatus =
  | 'delivered'
  | 'undelivered'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'receiving'
  | 'accepted'
  | 'scheduled'
  | 'read';

export type GetSMSDeliveryStatus = {
  sid: string;
  status: MessageStatus;
  error_code: number;
};

// POST register/validate-otp ================================
export type ValidateOTPPayload = {
  intent_id: string;
  intent_hash: string;
  code: number;
};

export type ValidateOTPResponse = { valid: true; message: string } | { valid: undefined; error: string };

// POST register/complete ================================

export type RegisterCompletePayload = {
  provider: 'email' | SocialLoginProvider;
  provider_payload: CheckGooglePayload | CheckApplePayload | undefined;
  intent_id: string;
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export type RegisterCompleteResponse =
  | {
      access_token: string;
      refresh_token: string;
      error: undefined;
    }
  | {
      error: string;
      access_token: undefined;
      refresh_token: undefined;
    };
