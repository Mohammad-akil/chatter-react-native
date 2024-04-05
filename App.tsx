import 'react-native-gesture-handler';
import './src/i18n';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { PortalProvider } from '@gorhom/portal';
import BootSplash from 'react-native-bootsplash';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { linkingConfig, StackNavigator } from '~/navigation';
import { toastConfig } from '~/ui/Toast';
import { AppState, Linking, StatusBar, StyleSheet } from 'react-native';
import { client } from '~/services/websocket';

import { NotificationEvent } from '~/services/websocket/types';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { commonStyles } from '~/styles';
import { useStorageUser } from '~/services/mmkv/auth';
import { conversationsState } from '~/screens/DirectMessages';
import { api } from '~/api';
import { CustomShowParams } from '~/ui/Toast/types';
import { Platform } from 'react-native';
import { initNotifications } from './notifications';
import notifee, { EventType } from '@notifee/react-native';
import Purchases from 'react-native-purchases';
//@ts-ignore
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import SharePopup from '~/components/SharePopup';

//@ts-ignore
import ShareMenu from 'react-native-share-menu';

import { sharePopupState } from './src/state';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

import type { RootStackParamList } from '~/navigation';
import messaging from '@react-native-firebase/messaging';

import { atom } from 'recoil';
import { User, users } from '~/entities/User';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { use } from 'i18next';
import axios from 'axios';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

const queryClient = new QueryClient();
async function initN() {
  await initNotifications(Platform.OS);
}
function initIAP(user: User) {
  console.log('[ChatterIAP]: Initializing RevenueCat');

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: 'appl_oqXuuzcPNNhnsyIyoQkDCjxMslt', appUserID: user.id });
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.syncPurchases();
  } else if (Platform.OS === 'android') {
    try {
      Purchases.configure({ apiKey: 'goog_LBbTQXsVBLUCRqfJBfBakdwRXbb', appUserID: user.id });
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      Purchases.syncPurchases();
    } catch (e) {
      console.log({
        error: 'There was an error configuring RevenueCat for Android.',
        message: e,
      });
    }
  }
}
async function openLink(notification: any) {
  console.log('Opening URL');
  const url = notification?.notification.data?.url as string;
  await Linking.openURL(url as string);
}
const App = () => {
  const handleShare = useCallback((item: any) => {
    console.log(item);
    if (!item) {
      return;
    }

    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (item.data && item.data.length > 0 && item.data[0].data && regex.test(item.data[0].data)) {
      Toast.show({
        type: 'success',
        text1: 'Shared a link',
        text2: item.data[0].data,
      });
    } else {
      if (item.data && item.data.length > 0 && item.data[0].data) {
        Toast.show({
          type: 'success',
          text1: 'Shared: ' + item.data[0].mimeType,
          text2: item.data[0].data,
        });
      }
    }

    const { mimeType, data, extraData } = item;
    // You can receive extra data from your custom Share View
    console.log({ mimeType, data, extraData });
  }, []);
  const [user] = useStorageUser();
  const navigationRef = useNavigationContainerRef();
  const appState = useRef(AppState.currentState);

  const [share, setIsShareOpen] = useRecoilState(sharePopupState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const setConversationsList = useSetRecoilState(conversationsState);

  type NotificationNavigate = any;

  useEffect(() => {
    const timeoutId = setTimeout(() => BootSplash.hide({ fade: true }), 500);

    return () => clearTimeout(timeoutId);
  }, []);
  const options = {
    ios: {
      appName: 'Chatter',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'phone_account_icon',
      additionalPermissions: [],
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.company.my',
        channelName: 'Foreground service for my app',
        notificationTitle: 'My app is running on background',
        notificationIcon: 'Path to the resource icon of the notification',
      },
    },
  };

  useEffect(() => {
    if (user) {
      console.log(`[User State]: Logged in as ${user.username}`);
      initIAP(user);
      initN();
      ReactNativeForegroundService.register();
    } else {
      console.log(`[User State]: Not logged in`);
    }
    return () => {
      ReactNativeForegroundService.stopAll();
      ReactNativeForegroundService.remove_all_tasks();
    };
  }, [user?.id, user]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');

        ShareMenu.getInitialShare(handleShare);
        notifee.getInitialNotification().then((notification) => {
          console.log('Initial Notification', notification);
          if (notification?.notification.data?.url) {
            openLink(notification);
          }
        });
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });
    return () => {
      subscription.remove();
    };
  }, [handleShare]);

  useEffect(() => {
    if (user?.id) {
      client.connect();
      client.on('connect', () => {
        client.on('notification', (message: NotificationEvent) => {
          console.log(message);
        });
      });
    }
  }, [setConversationsList, user?.id]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={commonStyles.flexFull}>
        <PortalProvider>
          <NavigationContainer linking={linkingConfig} ref={navigationRef}>
            <StatusBar animated barStyle={'light-content'} />
            <BottomSheetModalProvider>
              <StackNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
          <SharePopup
            open={share.open}
            setOpened={() => setIsShareOpen({ open: !share.open, title: 'test', url: 'test' })}
            title={share.title}
            message={share.title}
            url={share.url}
          />
          <Toast topOffset={60} config={toastConfig} />
          {/* <RoomWidget style={roomWidget.base} /> */}
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

const roomWidget = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: 120,
  },
});

export default App;
