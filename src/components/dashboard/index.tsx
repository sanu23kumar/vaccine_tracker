import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import strings from '../../assets/strings';
import useVtTheme from '../../assets/theme/useVtTheme';
import useAdmob from '../../services/ads';
import useAppInitialize from '../../services/app/useAppInitialize';
import Home from './home';
import Notifications from './notifications';
import Settings from './settings';
import VtWebView from './webview';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { colors } = useVtTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let icon = focused ? 'home' : 'home-outline';
          switch (route.name) {
            case strings.dashboard.settings.NAME:
              icon = focused ? 'settings' : 'settings-outline';
              break;
            case strings.dashboard.notifications.NAME:
              icon = focused ? 'notifications' : 'notifications-outline';
              break;
            default:
              break;
          }
          return <Icon color={color} name={icon} size={24} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.PRIMARY,
        inactiveTintColor: colors.TEXT_DISABLED,
        style: {
          backgroundColor: colors.BACKGROUND,
          height: 60,
          elevation: 0,
          borderTopWidth: 0,
        },
        labelStyle: {
          height: 0,
        },
        tabStyle: {
          backgroundColor: colors.BACKGROUND,
        },
      }}>
      <Tab.Screen name={strings.dashboard.home.NAME} component={Home} />
      <Tab.Screen
        name={strings.dashboard.notifications.NAME}
        component={Notifications}
      />
      <Tab.Screen name={strings.dashboard.settings.NAME} component={Settings} />
    </Tab.Navigator>
  );
};

const DashboardNavigator = () => {
  const initialized = useAppInitialize();
  useAdmob();

  if (!initialized) return null;
  SplashScreen.hide();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={strings.dashboard.webview.NAME}
        component={VtWebView}
      />
      <Stack.Screen name={'Default'} component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
