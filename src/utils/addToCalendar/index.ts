import * as CalendarEvent from 'react-native-add-calendar-event';
import CalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
import * as Permissions from 'react-native-permissions';
import { utcDateToString } from '~/utils';
import Toast from 'react-native-toast-message';
import { normalize } from '../normalize';
import { CustomShowParams } from '~/ui/Toast/types';
import { Linking, Platform } from 'react-native';
import { Dispatch, SetStateAction } from 'react';

export const addToCalendar = async (
  title: string,
  startDate: string,
  setIsAdded: Dispatch<SetStateAction<boolean>>,
) => {
  const event = {
    title: title,
    startDate: utcDateToString(startDate),
    endDate: utcDateToString(moment.utc(startDate).add(1, 'hours')),
  };

  const errorPermissions = () => {
    Toast.show({
      type: 'error',
      text1: `Something wrong. Please, add permissions and try again.`,
      topOffset: normalize(80),
      autoHide: true,
      props: {
        withButtons: true,
        onAccept: () => {
          Linking.openSettings();
        },
        acceptButtonText: 'Go to settings',
      },
    } as CustomShowParams);
  };

  const saveEvent = () => {
    setIsAdded(true);
    Toast.show({
      type: 'normal',
      text1: `You have a RSVP’d for ${title}`,
      topOffset: normalize(80),
      autoHide: true,
    } as CustomShowParams);
  };
  if (Platform.OS === 'ios') {
    Permissions.request(Permissions.PERMISSIONS.IOS.CALENDARS)
      .then((result) => {
        if (result !== Permissions.RESULTS.GRANTED) {
          errorPermissions();
          throw new Error(`No permission: ${result}`);
        }
        return CalendarEvent.presentEventCreatingDialog(event);
      })
      .then((eventInfo: CalendarEvent.CreateResult) => {
        if (JSON.stringify(eventInfo) !== JSON.stringify({ action: 'CANCELED' })) {
          saveEvent();
        }
      })
      .catch((error: string) => {
        console.warn(error);
      });
  } else {
    try {
      await CalendarEvents.requestPermissions(false);
      await CalendarEvents.checkPermissions(true);
      await CalendarEvents.findCalendars().then(async (res: any) => {
        if (res[0]?.type === 'com.google') {
          CalendarEvent.presentEventCreatingDialog(event).then((e) => {
            if (e.action === 'SAVED') saveEvent();
          });
        } else {
          await CalendarEvents.saveEvent(title, {
            startDate: utcDateToString(startDate),
            endDate: utcDateToString(moment.utc(startDate).add(1, 'hours')),
          }).then(() => {
            saveEvent();
          });
        }
      });
    } catch (error) {
      errorPermissions();
      return console.log(error);
    }
  }
};
