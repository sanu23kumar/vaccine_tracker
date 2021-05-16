import React, { createContext, useContext } from 'react';
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

const CreateNotificationProvider: React.FC = ({ children }) => {
  console.log('Creating notification provider');
  const onRegister = token => {
    console.log('Setting the token on register ', token);
  };
  const onNotification = notification => {
    console.log('A new notification arrived', notification);
  };
  const { createNotification, getToken } = new NotifService(
    onRegister,
    onNotification,
  );

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
