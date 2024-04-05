import { Linking, PlatformOSType, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  AndroidStyle,
  EventType,
  EventDetail,
} from '@notifee/react-native';
import { PermissionsAndroid } from 'react-native';
import { api } from '~/api';

// Get the device token

async function checkNotificationPermission() {
  const settings = await notifee.getNotificationSettings();

  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions has been authorized');
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log('Notification permissions has been denied');
  }
}
function onMessageReceived(message: any) {
  notifee.displayNotification(JSON.parse(message.data.notifee));
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification } = detail;
  console.log('Background event', type, notification);
  if (type === EventType.PRESS) {
    console.log('User pressed notification [Background]', notification);
  }
});

notifee.onForegroundEvent(async ({ type, detail }) => {
  const { notification } = detail;
  if (type === EventType.PRESS) {
    console.log('User pressed notification [Foreground]', notification);
    console.log(notification?.data?.url);
    const event = await Linking.openURL(notification?.data?.url as string);
    console.log(event);
  }
});

export async function initNotifications(os: PlatformOSType): Promise<void> {
  if (os == 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'defaultChannel',
      lights: false,
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    messaging().onMessage(onMessageReceived);
  }
  if (os == 'ios') {
    await messaging().requestPermission();
    messaging().onMessage(onMessageReceived);
  }
  const token = await messaging().getToken();
  console.log('Device Token', token);
  console.log('Registering device');
  try {
    await api.notifications.registerDevice(token, Platform.OS);
  } catch {
    console.log('Device already registered');
  }
}
