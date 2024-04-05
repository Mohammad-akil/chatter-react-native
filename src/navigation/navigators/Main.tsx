import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '~/screens/Home';
import { Profile } from '~/screens/Profile';
import Channel from '~/screens/Channel/screens/Channel';
import Discover from '~/screens/Discover/Discover';
import TabBarButton from '~/ui/TabBarButton';
import { colors } from '~/styles/colors';

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: colors.surface.bottomTabBar,
    borderTopColor: 'transparent',
  },
});

const ActionButtonComponent = () => null;

function tabBarIcon(name: string) {
  return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    let _iconName = name;
    if (focused) {
      _iconName = _iconName.split('-outline')[0];
    }
    return <Icon name={_iconName} color={color} size={size} />;
  };
}

const screenOptions = {
  tabBarInactiveTintColor: colors.text.textSecondary,
  tabBarActiveTintColor: colors.text.textDefault,
  tabBarStyle: style.tabBar,
};

const BottomTab = createBottomTabNavigator();

export default function Main() {
  return (
    <BottomTab.Navigator screenOptions={screenOptions}>
      <BottomTab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarIcon: tabBarIcon('home-outline'),
          tabBarShowLabel: true,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name='Discover'
        component={Discover}
        options={{
          tabBarIcon: tabBarIcon('search-outline'),
          tabBarShowLabel: true,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name='ActionButton'
        component={ActionButtonComponent}
        options={{
          headerShown: true,
          tabBarLabel: () => null,
          tabBarButton: () => <TabBarButton />,
        }}
      />
      <BottomTab.Screen
        name='Channel'
        component={Channel}
        options={{
          tabBarIcon: tabBarIcon('grid-outline'),
          tabBarShowLabel: true,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name='Profile'
        component={Profile}
        options={{
          tabBarIcon: tabBarIcon('person-outline'),
          tabBarShowLabel: true,
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
}
