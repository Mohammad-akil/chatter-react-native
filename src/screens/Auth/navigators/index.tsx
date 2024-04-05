import { useCallback } from 'react';
import { useResetRecoilState } from 'recoil';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import SignUpFillInfo from '../screens/SignUpFillInfo';
import VerifyAccount from '../screens/VerifyAccount';

import { signUpProcessIntent, signUpProcessProvider, singUpProcessData } from '../state';

type AuthStackList = Pick<
  RootStackParamList,
  'Login' | 'SignUpProcess' | 'SignUp' | 'SignUpFillInfo' | 'VerifyAccount'
>;

const Stack = createNativeStackNavigator<AuthStackList>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

const RegisterGroup = () => {
  const clearFilledData = useResetRecoilState(singUpProcessData);
  const clearIntentData = useResetRecoilState(signUpProcessIntent);
  const clearProviderData = useResetRecoilState(signUpProcessProvider);

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('clear sign up state');
        clearFilledData();
        clearIntentData();
        clearProviderData();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <Stack.Navigator initialRouteName='SignUp'>
      <Stack.Screen name='SignUp' options={screenOptions} component={SignUp} />
      <Stack.Screen name='SignUpFillInfo' options={screenOptions} component={SignUpFillInfo} />
      <Stack.Screen name='VerifyAccount' options={screenOptions} component={VerifyAccount} />
    </Stack.Navigator>
  );
};

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='Login' options={screenOptions} component={Login} />
      <Stack.Screen name='SignUpProcess' options={screenOptions} component={RegisterGroup} />
    </Stack.Navigator>
  );
};
