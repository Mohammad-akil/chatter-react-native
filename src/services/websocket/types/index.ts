import { RoomServiceOnEvents } from './RoomServiceEvents';

export type NotificationEvent = {
  type: string;
  payload: object;
};
export type OnEvent = {
  connect: () => void;
  message: (message: any) => void;
  notification: (message: NotificationEvent) => void;
  disconnect: (message: string) => void;
  'direct-message': (message: any) => void;
} & RoomServiceOnEvents;

export type OnEventKeys = keyof OnEvent;
export type OnEventValues<T extends keyof OnEvent> = OnEvent[T];
