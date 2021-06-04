import analytics from '@react-native-firebase/analytics';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useStore from 'potli/useStore';
import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import translations from '../assets/translations';
import DashboardNavigator from '../components/dashboard';
import CreateNotificationProvider from '../notifications/createNotificationProvider';
import useBackgroundFetch from '../services/useBackgroundFetch';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const scheme = useColorScheme();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const [isLanguageSet, setIsLanguageSet] = useState(false);
  const { data: userLanguage } = useStore('LANGUAGE');
  useEffect(() => {
    if (userLanguage?.name) {
      translations.setLanguage(userLanguage.name);
    }
    setIsLanguageSet(true);
  }, []);
  useBackgroundFetch();
  if (!isLanguageSet) return null;
  return (
    <CreateNotificationProvider navigation={navigationRef}>
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
    </CreateNotificationProvider>
  );
};

export default RootNavigator;
