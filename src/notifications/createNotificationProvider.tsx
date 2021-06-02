import React, { createContext, useContext, useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
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
  console.log('Creating notification provider');
  const onRegister = token => {
    console.log('Setting the token on register ', token);
  };
  const onNotification = notification => {
    // Get data from notification and set it to userData, then navigate the user to home
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
      if (!notification?.userData?.filter) return;
      console.log('Initial notification popped', notification);
      setData({ filter: notification.userData.filter });
      navigation?.current?.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
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
