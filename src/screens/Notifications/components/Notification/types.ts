import type { Notification } from '../../types';

export type NotificationProps = {
  shouldSkip?: boolean;
  avatar: string;
  date: string;
  payload: object;
  type: string;
  time: string;
} & Notification;
