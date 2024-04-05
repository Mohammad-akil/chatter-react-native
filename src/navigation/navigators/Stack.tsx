import * as React from 'react';

import { type NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '~/navigation';

import { AuthNavigator } from '~/screens/Auth';
import { Channels, Creators, Interests } from '~/screens/UserOnboarding';
import { DirectMessages, NewMessages } from '~/screens/DirectMessages';

import Home from '~/screens/Home';
import Welcome from '~/screens/Welcome';
import Notifications from '~/screens/Notifications';

import { CreateChannel } from '~/screens/CreateChannel';
import { ChannelAdmins, ChannelLeaders, EditChannel } from '~/screens/EditChannel';

import SocialAuth from '~/screens/SocialAuth';

import { NewRoomNavigator } from '~/screens/NewRoom';
import Settings from '~/screens/Settings';
import MyDrawer from './Drawer';
import { DMThread } from '~/screens/DMThread';
import DiscoverSearch from '~/screens/Discover/DiscoverSearch';
import { RoomNavigator } from '~/screens/Room/navigator';
import EditProfile from '~/screens/EditProfile';
import { ConversationsCarousel, NewConversation } from '~/screens/Conversation';
import { PreviewProfile } from '~/screens/Profile';
import { PreviewChannel } from '~/screens/Channel';
import { Community, CommunitySuggested } from '~/screens/Community';
import {
  ChatterCreator,
  DisplayAndLanguages,
  Monetization,
  NotificationsSettings,
  PrivacyAndSafety,
  Security,
  YourAccount,
} from '~/screens/Settings/navigator';
import PayoutWidget from '~/screens/Settings/screens/Monetization/trolley';
import {
  AccountInformation,
  ChangeYourPassword,
  DeactivateYourAccount,
} from '~/screens/Settings/screens/YourAccount/navigator';
import {
  UpdateCountry,
  UpdateEmail,
  UpdatePhone,
  UpdateUsername,
} from '~/screens/Settings/screens/YourAccount/screens/AccountInformation/navigator';
import {
  Content,
  DirectMessagesSettings,
  DiscoverabilityAndContacts,
  MuteAndBlock,
} from '~/screens/Settings/screens/PrivacyAndSafety/navigator';
import {
  BlockedAccounts,
  MutedAccounts,
} from '~/screens/Settings/screens/PrivacyAndSafety/screens/MuteAndBlock/navigator';
import {
  NotificationsRooms,
  PushNotifications,
  SMSNotifications,
} from '~/screens/Settings/screens/NotificationsSettings/navigator';
import { DisplayAndSound, Language } from '~/screens/Settings/screens/DisplayAndLanguages/navigator';
import { ConnectedSocials } from '~/screens/Settings/screens/ChatterCreator/navigator';
import Verification from '~/screens/Settings/screens/Verification';

import FollowingList from '~/screens/Profile/components/Following/FollowingList';
import ShareFeedback from '~/screens/ReportsAndFeedback/screens/ShareFeedback';
import { ReportChatMessage, ReportMessage } from '~/screens/ReportsAndFeedback';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  animation: 'slide_from_right',
};

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      {/* AUTH */}
      <Stack.Screen name='Auth' options={options} component={AuthNavigator} />

      {/* USER ONBOARDING */}
      <Stack.Screen name='Interests' options={options} component={Interests} />
      <Stack.Screen name='Channels' options={options} component={Channels} />
      <Stack.Screen name='Creators' options={options} component={Creators} />
      <Stack.Screen name='Welcome' component={Welcome} />

      {/* HOME */}
      <Stack.Screen name='Home' options={options} component={Home} />
      <Stack.Screen name='Notifications' options={options} component={Notifications} />

      {/* CHANNEL */}
      <Stack.Screen name='PreviewChannel' options={options} component={PreviewChannel} />
      <Stack.Screen name='CreateChannel' options={options} component={CreateChannel} />
      <Stack.Screen name='EditChannel' options={options} component={EditChannel} />
      <Stack.Screen name='ChannelAdmins' options={options} component={ChannelAdmins} />
      <Stack.Screen name='ChannelLeaders' options={options} component={ChannelLeaders} />

      {/* DIRECT */}
      <Stack.Screen name='DirectMessages' options={options} component={DirectMessages} />
      <Stack.Screen name='NewMessage' options={options} component={NewMessages} />
      <Stack.Screen name='DMThread' options={options} component={DMThread} />

      {/* ROOM */}
      <Stack.Screen
        name='RoomNavigator'
        component={RoomNavigator}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen name='NewRoom' options={options} component={NewRoomNavigator} />

      {/* PROFILE */}
      <Stack.Screen name='PreviewProfile' options={options} component={PreviewProfile} />
      <Stack.Screen name='EditProfile' options={options} component={EditProfile} />
      <Stack.Screen name='FollowingList' options={options} component={FollowingList} />

      <Stack.Screen name='SocialAuth' options={options} component={SocialAuth} />

      {/* SETTINGS */}
      <Stack.Screen name='YourAccount' options={options} component={YourAccount} />
      <Stack.Screen name='Settings' options={options} component={Settings} />
      <Stack.Screen name='ChatterCreator' options={options} component={ChatterCreator} />
      <Stack.Screen name='DisplayAndLanguages' options={options} component={DisplayAndLanguages} />
      <Stack.Screen name='PayoutWidget' options={options} component={PayoutWidget} />
      <Stack.Screen name='Monetization' options={options} component={Monetization} />
      <Stack.Screen name='NotificationsSettings' options={options} component={NotificationsSettings} />
      <Stack.Screen name='PrivacyAndSafety' options={options} component={PrivacyAndSafety} />
      <Stack.Screen name='Security' options={options} component={Security} />
      <Stack.Screen name='AccountInformation' options={options} component={AccountInformation} />
      <Stack.Screen name='ChangeYourPassword' options={options} component={ChangeYourPassword} />
      <Stack.Screen name='DeactivateYourAccount' options={options} component={DeactivateYourAccount} />
      <Stack.Screen name='UpdateUsername' options={options} component={UpdateUsername} />
      <Stack.Screen name='UpdatePhone' options={options} component={UpdatePhone} />
      <Stack.Screen name='UpdateEmail' options={options} component={UpdateEmail} />
      <Stack.Screen name='UpdateCountry' options={options} component={UpdateCountry} />
      <Stack.Screen name='Content' options={options} component={Content} />
      <Stack.Screen name='DirectMessagesSettings' options={options} component={DirectMessagesSettings} />
      <Stack.Screen name='MuteAndBlock' options={options} component={MuteAndBlock} />
      <Stack.Screen name='DiscoverabilityAndContacts' options={options} component={DiscoverabilityAndContacts} />
      <Stack.Screen name='BlockedAccounts' options={options} component={BlockedAccounts} />
      <Stack.Screen name='MutedAccounts' options={options} component={MutedAccounts} />
      <Stack.Screen name='PushNotifications' options={options} component={PushNotifications} />
      <Stack.Screen name='SMSNotifications' options={options} component={SMSNotifications} />
      <Stack.Screen name='NotificationsRooms' options={options} component={NotificationsRooms} />
      <Stack.Screen name='DisplayAndSound' options={options} component={DisplayAndSound} />
      <Stack.Screen name='Language' options={options} component={Language} />
      <Stack.Screen name='ConnectedSocials' options={options} component={ConnectedSocials} />
      <Stack.Screen name='Verification' options={options} component={Verification} />

      {/* DISCOVER */}
      <Stack.Screen name='DiscoverSearch' options={{ animation: 'none' }} component={DiscoverSearch} />

      {/* CONVERSATIONS */}
      <Stack.Screen name='NewConversation' component={NewConversation} />
      <Stack.Screen name='ConversationsCarousel' options={options} component={ConversationsCarousel} />
      {/* COMMUNITY */}
      <Stack.Screen name='Community' options={options} component={Community} />
      <Stack.Screen name='CommunitySuggested' options={options} component={CommunitySuggested} />

      {/* REPORT AND FEEDBACK */}
      <Stack.Screen name='ShareFeedback' options={options} component={ShareFeedback} />
      <Stack.Screen name='ReportMessage' options={options} component={ReportMessage} />
      <Stack.Screen name='ReportChatMessage' options={options} component={ReportChatMessage} />

      {/* TEST SCREENS */}

      <Stack.Screen name='Drawer' component={MyDrawer} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
