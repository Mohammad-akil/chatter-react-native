import { useCallback } from 'react';
import { useResetRecoilState } from 'recoil';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';

import RoomScheduled from '../steps/RoomScheduled';
import ScheduleRoom from '../steps/ScheduleRoom';
import RoomDetails from '../steps/RoomDetails';
import MainInfo from '../steps/MainInfo';

import { RootStackParamList } from '~/navigation';
import { roomState } from '../state';

type NewRoomStackList = Pick<
  RootStackParamList,
  'NewRoomMainInfo' | 'NewRoomDetails' | 'NewRoomSchedule' | 'NewRoomScheduled'
>;

const Stack = createNativeStackNavigator<NewRoomStackList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

export const NewRoomNavigator = () => {
  const clearState = useResetRecoilState(roomState);

  useFocusEffect(
    useCallback(() => {
      return () => clearState();
    }, []),
  );

  return (
    <Stack.Navigator initialRouteName='NewRoomMainInfo' screenOptions={screenOptions}>
      <Stack.Screen name='NewRoomMainInfo' options={screenOptions} component={MainInfo} />
      <Stack.Screen name='NewRoomDetails' options={screenOptions} component={RoomDetails} />
      <Stack.Screen name='NewRoomSchedule' options={screenOptions} component={ScheduleRoom} />
      <Stack.Screen name='NewRoomScheduled' options={screenOptions} component={RoomScheduled} />
    </Stack.Navigator>
  );
};
