import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useColorScheme } from 'react-native';
import DashboardNavigator from '../components/dashboard';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardNavigator} name={"Dashboard"}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
