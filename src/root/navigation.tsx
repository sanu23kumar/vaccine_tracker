import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import DashboardNavigator from '../components/dashboard';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const scheme = useColorScheme();
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardNavigator} name={'Dashboard'} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
