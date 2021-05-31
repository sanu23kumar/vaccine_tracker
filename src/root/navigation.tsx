import analytics from '@react-native-firebase/analytics';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { useColorScheme } from 'react-native';
import DashboardNavigator from '../components/dashboard';
import useBackgroundFetch from '../services/useBackgroundFetch';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const scheme = useColorScheme();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  useBackgroundFetch();
  return (
    <NavigationContainer
      theme={scheme === 'dark' ? DefaultTheme : DefaultTheme}
      ref={navigationRef}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={DashboardNavigator} name={'Dashboard'} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
