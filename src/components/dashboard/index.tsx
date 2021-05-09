import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './home';
import useAppInitialize from './useAppInitialize';

const Stack = createStackNavigator();
const DashboardNavigator = () => {
  useAppInitialize()
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Home} name="Home" />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
