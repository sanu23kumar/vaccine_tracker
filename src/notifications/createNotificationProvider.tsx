import React, { createContext, useContext, useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import strings from '../assets/strings';
import { useUserStore } from '../services/stores';
import NotifService from './NotifService';

interface Params {
  createNotification: (arg0: string, arg1?: string) => void;
  getToken: () => string | undefined;
}

const initialParams: Params = {
  createNotification: (title, message) => {},
  getToken: () => undefined,
};

export const NotificationContext = createContext(initialParams);

const CreateNotificationProvider: React.FC = ({ children, navigation }) => {
  const { setData } = useUserStore();
  const onRegister = token => {
    console.log('Setting the token on register ', token);
  };
  const onNotification = notification => {
    if (notification?.data?.link) {
      navigation?.current?.navigate(strings.dashboard.webview.NAME, {
        url: notification.data?.link,
        title: notification.data?.title,
        showAd: notification.data?.showAd,
      });
      return;
    }
    // Get data from notification and set it to userData, then navigate the user to home
    if (!notification?.userData?.filter) return;
    setData({ filter: notification.userData.filter });
    navigation?.current?.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };
  const { createNotification, getToken } = new NotifService(
    onRegister,
    onNotification,
  );

  useEffect(() => {
    PushNotification.popInitialNotification(notification => {
      console.log(notification);
      if (notification?.data?.link) {
        navigation?.current?.navigate(strings.dashboard.webview.NAME, {
          url: notification.data.link,
          title: notification.data?.title,
          showAd: notification.data?.showAd,
        });
        return;
      }
      if (!notification?.userData?.filter) return;
      console.log('Initial notification popped', notification);
      setData({ filter: notification.userData.filter });
      PushNotification.removeAllDeliveredNotifications();
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ createNotification, getToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};

export default CreateNotificationProvider;
