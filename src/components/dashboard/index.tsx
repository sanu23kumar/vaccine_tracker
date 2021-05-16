import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import strings from '../../assets/strings';
import useAdmob from '../../services/ads';
import useAppInitialize from '../../services/app/useAppInitialize';
import useBackgroundFetch from '../../services/useBackgroundFetch';
import Home from './home';
import Notifications from './notifications';

const Stack = createStackNavigator();
const DashboardNavigator = () => {
  useAppInitialize();
  useBackgroundFetch();
  useAdmob();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Home} name={strings.dashboard.home.NAME} />
      <Stack.Screen
        component={Notifications}
        name={strings.dashboard.notifications.NAME}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
