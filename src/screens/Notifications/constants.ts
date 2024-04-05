import type { Notification } from './types';

export const NotificationType = {
  LIVE_ROOM: 'LIVE_ROOM',
  STARTED_FOLLOWING: 'STARTED_FOLLOWING',
  CONVERSATION_RESPONSE: 'CONVERSATION_RESPONSE',
  ROOM_INVITATION: 'ROOM_INVITATION',
  ROOM_SCHEDULED: 'ROOM_SCHEDULED',
  FOLLOWING_GROUP: 'FOLLOWING_GROUP',
} as const;

export const NotificationGroup = {
  NEW: 'new',
  TODAY: 'today',
  WEEK: 'week',
  OLDER: 'older',
} as const;

export const notifications: Notification[] = [
  {
    id: '200',
    date: new Date().toDateString(),
    isRead: false,
    avatar: 'https://cdn.pixabay.com/photo/2011/12/13/14/31/earth-11015_640.jpg',
    type: NotificationType.LIVE_ROOM,
    payload: {
      companyName: 'Saving our World',
      companyId: '1',
      isJoined: false,
      roomId: '1',
      roomName: 'Deep Blue Dialogue: Saving Our Oceans',
    },
  },
  {
    id: '233232',
    date: new Date().toISOString(),
    isRead: false,
    avatar:
      'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    type: NotificationType.STARTED_FOLLOWING,
    payload: {
      isFollowing: false,
      userId: '1',
      userName: 'Jason Bourne',
    },
  },
  ...Array.from({ length: 13 }, (_, index) => ({
    id: `${index}`,
    date: new Date().toISOString(),
    isRead: false,
    avatar:
      'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    type: NotificationType.STARTED_FOLLOWING,
    payload: {
      isFollowing: false,
      userId: '1',
      userName: 'Jason Bourne',
    },
  })),
  {
    id: '100',
    date: new Date().toISOString(),
    isRead: true,
    avatar:
      'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    type: NotificationType.CONVERSATION_RESPONSE,
    payload: {
      userId: '1',
      userName: 'Sofia Vasquez',
      conversationId: '1',
      conversationName: 'Any dinner suggestions for Miami',
    },
  },
  {
    id: '101',
    date: new Date().toISOString(),
    isRead: true,
    avatar:
      'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    type: NotificationType.ROOM_INVITATION,
    payload: {
      userId: '1',
      userName: 'Nelson Epega',
      roomId: '1',
      roomName: 'Deep Blue Dialogue: Saving Our Oceans',
      scheduleDate: '2023-11-30T10:37:39.728Z',
    },
  },
  {
    id: '102',
    date: new Date().toISOString(),
    isRead: true,
    avatar: 'https://cdn.pixabay.com/photo/2011/12/13/14/31/earth-11015_640.jpg',
    type: NotificationType.ROOM_SCHEDULED,
    payload: {
      companyId: '1',
      companyName: 'Saving our World',
      scheduleDate: '2023-11-30T10:37:39.728Z',
      roomId: '1',
      roomName: 'Saving our World',
    },
  },
  {
    id: '103',
    date: '2023-11-25T10:37:39.728Z',
    isRead: true,
    avatar:
      'https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg',
    type: NotificationType.ROOM_INVITATION,
    payload: {
      userId: '1',
      userName: 'Nelson Epega',
      roomId: '1',
      roomName: 'Deep Blue Dialogue: Saving Our Oceans',
      scheduleDate: '2023-11-30T10:37:39.728Z',
    },
  },
  {
    id: '104',
    date: '2023-11-12T10:37:39.728Z',
    isRead: true,
    avatar: 'https://cdn.pixabay.com/photo/2011/12/13/14/31/earth-11015_640.jpg',
    type: NotificationType.ROOM_SCHEDULED,
    payload: {
      companyId: '1',
      companyName: 'Saving our World',
      scheduleDate: '2023-11-30T10:37:39.728Z',
      roomId: '1',
      roomName: 'Saving our World',
    },
  },
];
