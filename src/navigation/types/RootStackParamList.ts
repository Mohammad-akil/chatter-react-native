import { ReadyConversationTypes } from '~/entities/Conversations';
import { SocialLoginProvider } from '~/entities/SocialLogin';

type SignUpFillInfoProps = { provider: 'email'; email: string } | { provider: SocialLoginProvider; email?: string };

export type RootStackParamList = {
  // AUTH
  Auth: undefined;
  Login: undefined;
  SignUpProcess: { screen: 'SignUpFillInfo'; params: SignUpFillInfoProps } | { screen: 'SignUp' } | undefined;
  SignUp: undefined;
  SignUpFillInfo: SignUpFillInfoProps;
  VerifyAccount: undefined;
  SocialAuth: undefined;

  // ROOM
  RoomNavigator: { room_id: string; action_type: 'start' | 'join' };
  JoiningRoom: undefined;
  Room: undefined;
  RoomChat: undefined;
  RoomSettings: undefined;
  ClipMoment: undefined;

  // PROFILE
  Profile: undefined;
  PreviewProfile: { user_id: string };
  EditProfile: undefined;
  FollowingList: { view: 'followers' | 'following'; user: any };

  // SETTINGS
  YourAccount: undefined;
  Settings: undefined;
  ChatterCreator: undefined;
  DisplayAndLanguages: undefined;
  Monetization: undefined;
  PayoutWidget: undefined;
  NotificationsSettings: undefined;
  PrivacyAndSafety: undefined;
  Security: undefined;
  AccountInformation: undefined;
  ChangeYourPassword: undefined;
  DeactivateYourAccount: undefined;
  UpdateUsername: undefined;
  UpdatePhone: undefined;
  UpdateCountry: undefined;
  UpdateEmail: undefined;
  Content: undefined;
  MuteAndBlock: undefined;
  DirectMessagesSettings: undefined;
  DiscoverabilityAndContacts: undefined;
  BlockedAccounts: undefined;
  MutedAccounts: undefined;
  PushNotifications: undefined;
  SMSNotifications: undefined;
  NotificationsRooms: undefined;
  DisplayAndSound: undefined;
  Language: undefined;
  ConnectedSocials: undefined;
  Verification: undefined;

  // OTHERS
  Main: any;
  Conversation: undefined;
  Onboarding: undefined;
  OnboardingDetails: undefined;
  OnboardingAdmins: undefined;
  Home: undefined;
  Interests: { name: string };
  Channels: undefined;
  Creators: undefined;
  DirectMessages: undefined;
  DMThread: {
    chatId: string;
    boxUsers: string[];
  };
  Welcome: undefined;
  Notifications: undefined;

  // CHANNEL
  PreviewChannel: { channel_id: string };
  CreateChannel: undefined;
  Channel: undefined;
  EditChannel: undefined;
  Logout: undefined;
  ChannelAdmins: undefined;
  ChannelLeaders: undefined;
  Drawer: undefined;

  NewRoom: undefined;
  NewRoomMainInfo: undefined;
  NewRoomDetails: undefined;
  NewRoomSchedule: undefined;
  NewRoomScheduled: undefined;

  NewMessage: undefined;
  Discover: undefined;
  CommunitySuggested: undefined;
  Community: undefined;

  DiscoverSearch: undefined;

  // CONVERSATIONS
  NewConversation: undefined;
  ConversationsCarousel: { conversations: ReadyConversationTypes[] | undefined; index: number };

  // REPORT AND FEEDBACK
  ShareFeedback: undefined;
  ReportMessage: { title: string; message: string };
  ReportChatMessage: { user: any; message: any };

  ActionButton: undefined;

  Popup: undefined;
};
