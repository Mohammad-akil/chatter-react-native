import { Channel } from '~/entities/Channel';
import { RoomOld } from '~/entities/Room';

export const channelsData: Channel[] = [
  {
    id: '1',
    name: 'Understanding our World',
    description: 'Hello',
    subscribers: 1345,
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
  {
    id: '2',
    name: '433',
    description: 'Hello',
    subscribers: 1345,
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
  {
    id: '3',
    name: 'Cinematography',
    subscribers: 1345,
    description: 'Hello',
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
];
export const recentlyViewData: Channel[] = [
  {
    id: '1',
    name: 'Cinematography',
    description: 'Hello',
    subscribers: 1345,
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
  {
    id: '2',
    name: 'Cinematography',
    description: 'Hello',
    subscribers: 1345,
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
  {
    id: '3',
    name: 'Cinematography',
    subscribers: 1345,
    description: 'Hello',
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
  {
    id: '4',
    name: 'Cinematography',
    description: 'Hello',
    subscribers: 1345,
    avatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    owner: {
      id: '1',
      first_name: 'Vasyl',
      last_name: 'Tytsenko',
      username: 'vasyl',
    },
    follower_count: 0,
  },
];

export const momentsData = [
  {
    id: 1,
    title: 'Why our reefs are dying',
    viewed: 1345,
    liked: 120,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
  {
    id: 2,
    title: 'Why our reefs are dying',
    viewed: 2344,
    liked: 1243,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
  {
    id: 3,
    title: 'Why our reefs are dying',
    viewed: 2344,
    liked: 1243,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
  {
    id: 4,
    title: 'Why our reefs are dying',
    viewed: 1345,
    liked: 120,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
  {
    id: 5,
    title: 'Why our reefs are dying',
    viewed: 2344,
    liked: 1243,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
  {
    id: 6,
    title: 'Why our reefs are dying',
    viewed: 2344,
    liked: 1243,
    previewVideo:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  },
];

export const pastRooms: RoomOld[] = [
  {
    id: '1',
    name: 'Deep Blue Dialogue: Saving Our Oceans',
    description: 'Let’s talk about ways we can save our marine life',
    channelName: 'Understanding our World',
    channelSubscribers: 1234,
    channelAvatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    messages: 123,
    status: 'past',
    privacy: 'private',
    thumbnail:
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    started_at: new Date(2024, 0, 3, 18, 1, 32).toISOString(),
    ended_at: new Date(2024, 0, 3, 20, 45, 32).toISOString(),
    users: [],
    tags: ['Environment'],
  },
  {
    id: '2',
    name: 'Cleaning our beaches',
    description: 'How you can keep beaches clean',
    channelName: 'Understanding our World',
    channelSubscribers: 1234,
    channelAvatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    messages: 123,
    status: 'past',
    privacy: 'subscribers',
    thumbnail:
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    started_at: new Date(2024, 0, 3, 18, 1, 32).toISOString(),
    ended_at: new Date(2024, 0, 5, 20, 45, 32).toISOString(),
    users: [],
    tags: [],
  },
];
