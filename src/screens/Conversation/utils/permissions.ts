import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import { errorPermissions } from '~/utils';

export const permissions = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version < 33) {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          return errorPermissions();
        }
      }

      const grants = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

      if (grants !== PermissionsAndroid.RESULTS.GRANTED) {
        return errorPermissions();
      } else {
        return 'granted';
      }
    } catch (err) {
      console.warn(err);

      return;
    }
  } else if (Platform.OS === 'ios') {
    try {
      const audioPermissionStatus = await check(PERMISSIONS.IOS.MICROPHONE);
      if (audioPermissionStatus !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        if (result !== RESULTS.GRANTED) {
          return errorPermissions();
        } else {
          return 'granted';
        }
      } else {
        return 'granted';
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.message,
      } as CustomShowParams);

      return;
    }
  }
};
