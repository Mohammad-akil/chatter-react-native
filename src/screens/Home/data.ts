import type { RoomOld } from '~/entities/Room';
import { users } from '~/entities/User';

export const usersImages = [
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
];

export const roomsData: RoomOld[] = [
  {
    id: '1',
    name: 'Test',
    description: 'Let’s talk about ways we can save our marine life',
    channelName: 'Understanding our World',
    channelSubscribers: 1234,
    channelAvatar:
      'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    messages: 123,
    status: 'live',
    privacy: 'open',
    thumbnail:
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
    ended_at: null,
    users: users,
    tags: [],
  },
  // {
  //   id: '2',
  //   name: 'My Top 5 Movies of all time',
  //   description: 'Let’s talk about movies!!',
  //   channelName: 'Cinematography',
  //   channelSubscribers: 15236,
  //   channelAvatar:
  //     'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   messages: 123,
  //   status: 'live',
  //   privacy: 'subscribers',
  //   thumbnail:
  //     'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  //   ended_at: null,
  //   users: users,
  //   tags: ['Cinema', 'Movies'],
  // },
  // {
  //   id: '3',
  //   name: 'Best tactics in football',
  //   description: 'Let’s talk about football!',
  //   channelName: '433',
  //   channelSubscribers: 23685233,
  //   channelAvatar:
  //     'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   messages: 2363,
  //   status: 'live',
  //   privacy: 'open',
  //   thumbnail:
  //     'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  //   ended_at: null,
  //   users: users,
  //   tags: ['Football'],
  // },
  // {
  //   id: '4',
  //   name: 'Deep Blue Dialogue: Saving Our Oceans',
  //   description: 'Let’s talk about ways we can save our marine life',
  //   channelName: 'Understanding our World',
  //   channelSubscribers: 1234,
  //   channelAvatar:
  //     'https://images.pexels.com/photos/305810/pexels-photo-305810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   messages: 123,
  //   status: 'live',
  //   privacy: 'private',
  //   thumbnail:
  //     'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  //   ended_at: null,
  //   users: users,
  //   tags: [],
  // },
  // {
  //   id: '5',
  //   name: 'My Top 5 Movies of all time',
  //   description: 'Let’s talk about movies!!',
  //   channelName: 'Cinematography',
  //   channelSubscribers: 15236,
  //   channelAvatar:
  //     'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   messages: 123,
  //   status: 'live',
  //   privacy: 'subscribers',
  //   thumbnail:
  //     'https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  //   ended_at: null,
  //   users: users,
  //   tags: ['Cinema', 'Movies'],
  // },
  // {
  //   id: '6',
  //   name: 'Best tactics in football',
  //   description: 'Let’s talk about football!',
  //   channelName: '433',
  //   channelSubscribers: 23685233,
  //   channelAvatar:
  //     'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   messages: 2363,
  //   status: 'upcoming',
  //   privacy: 'open',
  //   thumbnail:
  //     'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  //   started_at: new Date(2024, 0, 8, 14, 23, 22).toISOString(),
  //   ended_at: null,
  //   users: users,
  //   tags: ['Football'],
  // },
];
