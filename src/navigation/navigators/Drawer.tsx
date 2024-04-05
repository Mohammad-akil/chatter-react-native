// @ts-nocheck
import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Main from './Main';
import Register from '../../screens/Auth/screens/SignUp';
import Login from '../../screens/Auth/screens/Login';
import VerifyAccount from '../../screens/Auth/screens/VerifyAccount';
import DevPlayer from '../../screens/DevPlayer';

import CreateChannel from '../../screens/CreateChannel/CreateChannel';
import { useStorageUser } from '~/services/mmkv/auth';
import { Community } from '~/screens/Community';
import IAP from '~/screens/Dev/IAP';
import ShareFeedback from '~/screens/ReportsAndFeedback/screens/ShareFeedback';
import { ReportChatMessage } from '~/screens/ReportsAndFeedback';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [user] = useStorageUser();
  // const userData = JSON.parse(user);

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: 'rgba(15, 15, 15, 0.98)' }}>
      <Image
        style={{
          width: 45,
          height: 45,
          borderRadius: 25,
          marginLeft: 10,
          marginTop: 10,
        }}
        source={{
          uri: user?.avatar
            ? `https://content.chattersocial.io/avatars/${user.avatar}.png`
            : 'https://content.chattersocial.io/avatars/default_avatar.png',
        }}
      />
      <Text
        style={{
          marginLeft: 10,
          marginTop: 10,
          fontWeight: 'bold',
          color: 'gray',
        }}
      >
        {`${user?.first_name} ${user?.last_name}`}
      </Text>
      <Text
        style={{
          marginLeft: 10,
          marginBottom: 10,
          fontWeight: '400',
          color: 'gray',
        }}
      >
        {`@${user?.username}`}
      </Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName='Main' drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name='Main'
        component={Main}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerShown: false,
          title: 'Main',
          drawerIcon: ({ size }) => <Icon name='user-plus' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='Register'
        component={Register}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerShown: false,
          title: 'Register',
          drawerIcon: ({ size }) => <Icon name='user-plus' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='Login'
        component={Login}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerShown: false,
          title: 'Login',
          drawerIcon: ({ size }) => <MaterialIcon name='dynamic-form' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='VerifyAccount'
        component={VerifyAccount}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white',
          },
          headerShown: false,
          title: 'Verify Account',
          drawerIcon: ({ size }) => <MaterialIcon name='password' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='CreateChannel'
        component={CreateChannel}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'white',
          },
          title: 'Create Channel',
          headerShown: false,
          drawerIcon: ({ size }) => <Icon name='cog' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='IAP'
        component={IAP}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'black',
          },
          title: 'In-App Payments',
          headerShown: false,
          drawerIcon: ({ size }) => <Icon name='dollar' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='Player'
        component={DevPlayer}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'black',
          },
          title: 'Player',
          headerShown: false,
          drawerIcon: ({ size }) => <Icon name='dollar' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='ShareFeedback'
        component={ShareFeedback}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'black',
          },
          title: 'ShareFeedback',
          headerShown: false,
          drawerIcon: ({ size }) => <Icon name='dollar' size={size} color='grey' />,
        }}
      />
      <Drawer.Screen
        name='Report Chat Message'
        component={ReportChatMessage}
        options={{
          drawerLabelStyle: {
            color: 'white',
          },
          headerTitleStyle: {
            color: 'black',
          },
          title: 'Report Chat Message',
          headerShown: false,
          drawerIcon: ({ size }) => <Icon name='dollar' size={size} color='grey' />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MyDrawer;
