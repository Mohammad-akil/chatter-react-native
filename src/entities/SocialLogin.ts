export type SocialLoginProvider = 'apple' | 'google';
// | 'twitter' | 'facebook';

export type SocialLogin = {
  id: string;
  provider: SocialLoginProvider;
  provider_id: string;
};
