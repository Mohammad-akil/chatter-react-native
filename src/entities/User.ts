import { ParticipantRole } from './Room';
import { SocialLogin } from './SocialLogin';

export type UserMetadata = {
  user_id: string;
  user_username: string;
  user_first_name: string;
  user_last_name: string;
  user_avatar: string | null | undefined;
  role: ParticipantRole;
  verified: boolean;
};

export type OwnedChannel = {
  id: string;
  avatar: string | null;
  name: string;
};
export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar: string | null;
  username: string;
  monetization_enabled: boolean;
  pro_subscribed: boolean;
  profile_audio_description: string | null;
  profile_description: string;
  online: boolean;
  social_logins: SocialLogin[];
  owned_channels: OwnedChannel[];
  follower_count: number;
  following_count: number;
  verified: boolean;
};

export type UserProfile = Pick<
  User,
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'username'
  | 'avatar'
  | 'profile_description'
  | 'owned_channels'
  | 'follower_count'
  | 'following_count'
  | 'verified'
>;

export const users: User[] = [
  {
    id: '1',
    email: 'vasyl@chattersocial.io',
    first_name: 'Vasyl',
    last_name: 'Tytseiko',
    phone_number: '+380679998833',
    avatar:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    username: 'vasyl22',
    online: false,
    monetization_enabled: false,
    pro_subscribed: false,
    profile_description: '',
    social_logins: [],
    profile_audio_description: null,
    owned_channels: [],
    follower_count: 0,
    following_count: 0,
    verified: false,
  },
  {
    id: '2',
    email: 'yeahscience@gmail.com',
    first_name: 'Walter',
    last_name: 'White',
    phone_number: '+380679992333',
    avatar:
      'https://e3.365dm.com/17/01/1600x900/7f300145b0ec76d45c983de7ef47e14aac9c092e19f886c43b99af016e519d0b_3879114.jpg?20230213182404',
    username: 'walterwhite',
    online: false,
    monetization_enabled: false,
    pro_subscribed: false,
    profile_description: '',
    social_logins: [],
    profile_audio_description: null,
    owned_channels: [],
    follower_count: 0,
    following_count: 0,
    verified: false,
  },
  {
    id: '3',
    email: 'bettercallsaul@gmail.com',
    first_name: 'Saul',
    last_name: 'Goodman',
    phone_number: '+380674562343',
    avatar: 'https://i.pinimg.com/736x/78/48/29/7848297c04b1d0f4d927b8b9047d7631.jpg',
    username: 'bettercallsaul',
    online: false,
    monetization_enabled: false,
    pro_subscribed: false,
    profile_description: '',
    social_logins: [],
    profile_audio_description: null,
    owned_channels: [],
    follower_count: 0,
    following_count: 0,
    verified: false,
  },
  {
    id: '4',
    email: 'yo_jesse_yo@gmail.com',
    first_name: 'Jesse',
    last_name: 'Pinkman',
    phone_number: '+380674562334',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKnfUeQGdoWnByKtoNu9CRO6hP8P3ZimIp6tTDMrzce88EZYdM9wY4nCojzbBEfkVsr7M&usqp=CAU',
    username: 'jesse',
    online: false,
    monetization_enabled: false,
    pro_subscribed: false,
    profile_description: '',
    social_logins: [],
    profile_audio_description: null,
    owned_channels: [],
    follower_count: 0,
    following_count: 0,
    verified: false,
  },
];
