import { FC, memo } from 'react';
import { NativeModules, Platform, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { APPLE_ANDROID_CLIENT_ID, APPLE_LOGIN_REDIRECT_URI } from '@env';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { styles } from './styles';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import { useSetRecoilState } from 'recoil';
import { signUpProcessIntent, signUpProcessProvider } from '../../state';

type SocialLoginButtonsProps = {
  style?: StyleProp<ViewStyle>;
};

export const socialLoginApps = [
  { name: 'Apple', icon: 'logo-apple' },
  { name: 'Google', icon: 'logo-google' },
  { name: 'Twitter', icon: 'logo-twitter' },
  // COMING SOON
  // { name: 'Twitter', icon: 'logo-twitter' },
  // { name: 'Facebook', icon: 'logo-facebook' },
];
const platform = Platform.OS;

const SocialLoginButtons: FC<SocialLoginButtonsProps> = ({ style }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const setProviderPayload = useSetRecoilState(signUpProcessProvider);
  const setIntent = useSetRecoilState(signUpProcessIntent);
  const socialLogin = async (provider: string) => {
    try {
      switch (provider) {
        case 'Google':
          try {
            await GoogleSignin.signOut();
            await GoogleSignin.signIn();
            const { accessToken, idToken } = await GoogleSignin.getTokens();

            const socialLoginExists = await api.auth.checkSocialProvider('google', {
              accessToken,
              idToken,
            });

            if (!socialLoginExists?.isChatterUser) {
              const intent = await api.auth.getIntent(platform as 'ios' | 'android');
              if (!intent) {
                return;
              }
              setIntent({ id: intent.id, hash: intent.hash });
              setProviderPayload({
                provider: 'google',
                provider_payload: {
                  accessToken,
                  idToken,
                },
              });

              console.log(socialLoginExists?.provider_result, 'PROVIDER RES');

              navigation.navigate('SignUpProcess', {
                screen: 'SignUpFillInfo',
                params: { provider: 'google', email: socialLoginExists?.provider_result.email },
              });
              return;
            }
            const { error } = await api.auth.login('google', { token: accessToken });
            await api.auth.me();
            navigation.navigate('Drawer');
          } catch (error) {
            console.log(error);
          }
          break;
        case 'Apple':
          if (Platform.OS === 'android') {
            try {
              console.log(APPLE_ANDROID_CLIENT_ID);
              const rawNonce = uuid();
              const state = uuid();
              appleAuthAndroid.configure({
                clientId: APPLE_ANDROID_CLIENT_ID,
                redirectUri: APPLE_LOGIN_REDIRECT_URI,
                responseType: appleAuthAndroid.ResponseType.ALL,
                scope: appleAuthAndroid.Scope.ALL,
                nonce: rawNonce,
                state,
              });
              const response = await appleAuthAndroid.signIn();

              if (!response.id_token || !response.nonce) {
                Toast.show({
                  type: 'error',
                  text1: 'Something went wrong',
                } as CustomShowParams);
                return;
              }

              const socialLoginExists = await api.auth.checkSocialProvider('apple', {
                code: response.code,
                id_token: response.id_token,
                nonce: response.nonce,
                state: response.state,
              });

              if (!socialLoginExists?.isChatterUser) {
                const intent = await api.auth.getIntent(platform as 'ios' | 'android');
                if (!intent) {
                  return;
                }

                setIntent({ id: intent.id, hash: intent.hash });
                setProviderPayload({
                  provider: 'apple',
                  provider_payload: {
                    code: response.code,
                    id_token: response.id_token,
                    nonce: response.nonce,
                    state: response.state,
                  },
                });
                navigation.navigate('SignUpProcess', {
                  screen: 'SignUpFillInfo',
                  params: { provider: 'apple', email: socialLoginExists?.provider_result.email },
                });
                return;
              }

              await api.auth.login('apple', { token: response.id_token, nonce: response.nonce });
              await api.auth.me();
              navigation.navigate('Drawer');
            } catch (error) {
              console.log(error);
            }
          }
          if (Platform.OS === 'ios') {
            try {
              const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
              });
              const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

              if (credentialState === appleAuth.State.AUTHORIZED) {
                if (!appleAuthRequestResponse.authorizationCode || !appleAuthRequestResponse.identityToken) {
                  Toast.show({
                    type: 'error',
                    text1: 'Something went wrong',
                  } as CustomShowParams);
                  return;
                }

                const socialLoginExists = await api.auth.checkSocialProvider('apple', {
                  code: appleAuthRequestResponse.authorizationCode,
                  id_token: appleAuthRequestResponse.identityToken,
                  nonce: appleAuthRequestResponse.nonce,
                  state: appleAuthRequestResponse.state,
                });
                if (!socialLoginExists?.isChatterUser) {
                  const intent = await api.auth.getIntent(platform as 'ios' | 'android');
                  if (!intent) {
                    return;
                  }
                  setIntent({ id: intent.id, hash: intent.hash });
                  setProviderPayload({
                    provider: 'apple',
                    provider_payload: {
                      code: appleAuthRequestResponse.authorizationCode,
                      id_token: appleAuthRequestResponse.identityToken,
                      nonce: appleAuthRequestResponse.nonce,
                      state: appleAuthRequestResponse.state,
                    },
                  });
                  navigation.navigate('SignUpProcess', {
                    screen: 'SignUpFillInfo',
                    params: { provider: 'apple', email: socialLoginExists?.provider_result.email },
                  });
                  return;
                }
                // ELSE
                await api.auth.login('apple', {
                  token: appleAuthRequestResponse.identityToken,
                });
                await api.auth.me();
                navigation.navigate('Drawer');
              }
            } catch (error) {
              console.log(error);
            }
          }
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex gap={8} style={style}>
      {socialLoginApps.map((social) => (
        <Button
          key={social.name}
          type='black'
          onPress={() => socialLogin(social.name)}
          iconName={social.icon}
          iconPosition='left'
          style={styles.button}
          text={t('common.continueWith', { socialName: social.name })}
        />
      ))}
    </Flex>
  );
};

export default memo(SocialLoginButtons);
