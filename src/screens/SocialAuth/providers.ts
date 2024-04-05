import { AuthConfiguration } from 'react-native-app-auth';

const instagram: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
  },
  clientId: '1886586148466154',
  clientSecret: 'b6e884541365ea9c3c80311c53a20552',
  iosCustomBrowser: 'safari',
  redirectUrl: 'https://chattersocial.io/auth',
  scopes: ['user_profile'],
  skipCodeExchange: true,
};

const twitch: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://id.twitch.tv/oauth2/authorize',
    tokenEndpoint: 'https://id.twitch.tv/oauth2/token',
  },
  clientId: 'q57xlm32x2vvz7oywjoxamcto90zz5',
  clientSecret: 'u678628flwahgj2c5juiysvp2cvkda',
  iosCustomBrowser: 'safari',
  issuer: 'https://id.twitch.tv',
  redirectUrl: 'https://chattersocial.io/app/test/',
  scopes: ['channel:read:stream_key'],
  skipCodeExchange: true,
  androidAllowCustomBrowsers: ['chrome'],
};

const twitter: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
  },
  usePKCE: true,
  clientId: 'MENBSVk1aTh5VmZRZ1BtVmVWc0M6MTpjaQ',
  iosCustomBrowser: 'safari',
  issuer: 'https://id.twitch.tv',
  redirectUrl: 'https://chattersocial.io/app/oauth',
  scopes: ['tweet.read', 'users.read'],
  skipCodeExchange: false,
};

const tiktok: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.tiktok.com/v2/auth/authorize/',
    tokenEndpoint: 'https://open.tiktokapis.com/v2/oauth/token/',
  },
  usePKCE: false,
  clientId: 'awxs3wxkkkm4m1q0',
  additionalParameters: {
    client_key: 'awxs3wxkkkm4m1q0',
  },
  iosCustomBrowser: 'safari',
  issuer: 'https://id.twitch.tv',
  redirectUrl: 'https://chattersocial.io/app/social-auth/tik-tok',
  scopes: ['user.info.basic', 'user.info.profile'],
  skipCodeExchange: false,
};

const facebook: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.facebook.com/v19.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v19.0/oauth/access_token',
  },
  usePKCE: true,
  clientId: '959951618898493',
  iosCustomBrowser: 'safari',
  issuer: 'https://id.twitch.tv',
  redirectUrl: 'https://chattersocial.io/app/social-auth/facebook',
  scopes: ['public_profile', 'user_link'],
  skipCodeExchange: false,
};

const linkedin: AuthConfiguration = {
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  },
  usePKCE: true,
  clientId: '86xlmdjpfsu09e',
  clientSecret: 'xn1FSrwb1IWPoNOi',
  iosCustomBrowser: 'safari',
  issuer: 'https://id.twitch.tv',
  redirectUrl: 'https://chattersocial.io/app/social-auth/linkedin',
  scopes: ['openid', 'profile', 'email'],
  skipCodeExchange: true,
};

export const config = {
  instagram,
  twitch,
  twitter,
  tiktok,
  facebook,
  linkedin,
};
