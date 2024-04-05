import dayjs from 'dayjs';
import { NotificationType } from './constants';
import type { FollowingGroupNotification, Notification, NotificationGroup } from './types';

export const groupNotificationsByCategory = (notifications: Notification[]) => {
  const today = dayjs();
  const groups: Record<'new' | 'today' | 'week' | 'older', Notification[]> = {
    new: [],
    today: [],
    week: [],
    older: [],
  };

  const addNotification = (group: NotificationGroup, notification: Notification) => {
    const selectedGroup = groups[group];
    const startFollowingNotifications = selectedGroup.filter(({ type }) => type === NotificationType.STARTED_FOLLOWING);

    if (notification.type === NotificationType.STARTED_FOLLOWING && startFollowingNotifications.length === 1) {
      const followingGroupIndex = selectedGroup.findIndex(({ type }) => type === NotificationType.FOLLOWING_GROUP);

      if (followingGroupIndex === -1) {
        selectedGroup.push({
          id: notification.id,
          type: 'FOLLOWING_GROUP',
          date: notification.date,
          isRead: notification.isRead,
          payload: {
            mainAvatar: notification.avatar,
            mainUserId: notification.payload.userId,
            mainUserName: notification.payload.userName,
            avatars: [],
            userIds: [],
            userNames: [],
          },
        });
      } else {
        const followingGroup = selectedGroup[followingGroupIndex] as FollowingGroupNotification;

        followingGroup.payload.avatars.push(notification.avatar);
        followingGroup.payload.userIds.push(notification.payload.userId);
        followingGroup.payload.userNames.push(notification.payload.userName);
      }
    } else {
      groups[group].push(notification);
    }
  };

  notifications.forEach((notification) => {
    if (!notification.isRead) {
      return addNotification('new', notification);
    }

    const isToday = dayjs(notification.date).isToday();

    if (isToday) {
      return addNotification('today', notification);
    }

    const daysDiff = today.diff(notification.date, 'd');

    if (daysDiff <= 7) {
      return addNotification('week', notification);
    }

    addNotification('older', notification);
  });

  return groups;
};

export const getCategoryTitleBySlug = (slug: string) => {
  switch (slug) {
    case 'week':
      return 'Last 7 Days';
    default:
      return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
};
