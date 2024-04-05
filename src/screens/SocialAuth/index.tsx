import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import ScreenHeader from '~/components/ScreenHeader';
import Flex from '~/ui/Flex';
import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';
import Button from '~/ui/Button';
import JSONTree from 'react-native-json-tree';
import { config } from './providers';
import axios, { AxiosResponse } from 'axios';
import { api } from '~/api';

function SocialAuth() {
  const [authResponse, setAuthResponse] = useState<any>({});
  const [user, setUser] = useState<any>({});

  async function auth(provider: keyof typeof config | 'tiktok') {
    try {
      const result = await authorize(config[provider]);
      await api.profile.addSocialLink(provider, result.authorizationCode, result.accessToken);
      setAuthResponse(result);
      console.log(result);
      if (provider == 'twitter') {
        // const user = await axios.get('https://api.twitter.com/2/users/me', {
        //   headers: {
        //     Authorization: `Bearer ${result.accessToken}`,
        //   },
        // });
        // //@ts-ignore
        // user.data.data.platform = 'twitter';
        // setUser(user.data.data);
      }
      if (provider == 'instagram') {
        const IGFormData = new FormData();
        IGFormData.append('client_id', config.instagram.clientId);
        IGFormData.append('client_secret', config.instagram.clientSecret);
        IGFormData.append('grant_type', 'authorization_code');
        IGFormData.append('redirect_uri', config.instagram.redirectUrl);
        IGFormData.append('code', result.authorizationCode);

        fetch(`https://api.instagram.com/oauth/access_token`, {
          method: 'POST',
          body: IGFormData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log(response.json());
          })
          .then((data) => {
            console.log('Response received:', data); // Handle the response data here
          })
          .catch((error) => {
            console.error('There was a problem with your fetch operation:', error); // Handle any errors that occur during the fetch operation
          });
        // const user = await axios.get(
        //   `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken.data.access_token}`,
        // );
        // //@ts-ignore
        // user.platform = 'instagram';
        // setUser(user.data);
      }
      if (provider == 'twitch') {
        const TwitchFormData = new FormData();
        TwitchFormData.append('client_id', config.twitch.clientId);
        TwitchFormData.append('client_secret', config.twitch.clientSecret);
        TwitchFormData.append('grant_type', 'authorization_code');
        TwitchFormData.append('redirect_uri', config.twitch.redirectUrl);
        TwitchFormData.append('code', result.authorizationCode);

        const accessToken = await axios.post(`https://id.twitch.tv/oauth2/token`, TwitchFormData);
        console.log(accessToken.data.access_token);
        const user = await axios.get(`https://id.twitch.tv/oauth2/validate`, {
          headers: {
            Authorization: `OAuth ${accessToken.data.access_token}`,
          },
        });
        console.log(user.data);
        //@ts-ignore
        console.log({
          headers: {
            Authorization: `Bearer ${accessToken.data.access_token}`,
            'Client-Id': config.twitch.clientId,
          },
        });
        const streamKey = await axios.get(
          `https://api.twitch.tv/helix/streams/key?broadcaster_id=${user.data.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken.data.access_token}`,
              'Client-Id': config.twitch.clientId,
            },
          },
        );
        //@ts-ignore
        user.data.stream_key = streamKey.data.data[0].stream_key;
        //@ts-ignore
        user.data.platform = 'twitch';
        setUser(user.data);
      }
    } catch (error: AxiosResponse | any) {
      console.error(error);
    }
  }
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={`Social Auth`} />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex gap={2}>
          <Button text='Twitch' onPress={() => auth('twitch')} />
          <Button text='Facebook' onPress={() => auth('facebook')} />
          <Button text='Instagram' onPress={() => auth('instagram')} />
          <Button text='X (Twitter)' onPress={() => auth('twitter')} />
          <Button text='TikTok' onPress={() => auth('tiktok')} />
          <Button text='LinkedIn' onPress={() => auth('linkedin')} />
        </Flex>
      </Flex>
      <View style={{ width: '100%' }}>
        {/* <JSONTree data={authResponse as any} hideRoot={true} /> */}
        <JSONTree data={user as any} hideRoot={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  generalContainer: {
    paddingVertical: normalize(10),
  },
  title: {
    paddingTop: 16,
    paddingBottom: 8,
    maxWidth: '100%',
    fontSize: 24,
    color: '#00CED1',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.2,
    borderColor: '#2C2C2EFF',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});

export default SocialAuth;
