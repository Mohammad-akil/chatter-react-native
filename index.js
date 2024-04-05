import { AppRegistry, Platform, UIManager, Button, Text, View, Image } from 'react-native';
import { useEffect, useCallback, useState } from 'react';
import { GiphyContentType, GiphyDialog, GiphySDK } from '@giphy/react-native-sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { registerGlobals } from '@livekit/react-native';
import { GIPHY_API_KEY, GOOGLE_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import App from './App';
import { name as appName } from './app.json';
import { RecoilRoot } from 'recoil';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { LogBox } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import { PlaybackService } from '~/services/playback';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs(['The player has already been']); // Ignore log notification by message
LogBox.ignoreLogs(['The player is not initialized']); // Ignore log notification by message

registerGlobals();
dayjs.extend(relativeTime);
dayjs.extend(isToday);

TrackPlayer.registerPlaybackService(() => PlaybackService);
TrackPlayer.setupPlayer();

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Main = () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

GiphySDK.configure({ apiKey: GIPHY_API_KEY });
GiphyDialog.configure({ mediaTypeConfig: [GiphyContentType.Gif] });
GoogleSignin.configure({ iosClientId: IOS_CLIENT_ID, webClientId: GOOGLE_CLIENT_ID });

async function onBackgroundNoticiation(remoteMessage) {
  const notification = JSON.parse(remoteMessage.data.notifee);
  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    data: notification.data,
    android: notification.android,
    ios: notification.ios,
  });
}

messaging().setBackgroundMessageHandler(onBackgroundNoticiation);

// function HeadlessCheck({ isHeadless }) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }
//   return <App />;
// }

AppRegistry.registerComponent(appName, () => Main);
