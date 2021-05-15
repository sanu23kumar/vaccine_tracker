import React, { createContext } from 'react';
import { initialUser, UserModel } from '../services/models/user';
import Store from './store';

export const USER_DATA_KEY = 'USER_DATA_KEY';

export const UserContext = createContext({
  data: initialUser,
  setDataToStore: (data: UserModel) => {
    console.log(USER_DATA_KEY, data);
  },
  removeData: () => {},
});

const UserStore: React.FC = ({ children }) => (
  <Store storeKey={USER_DATA_KEY} initData={initialUser} context={UserContext}>
    {children}
  </Store>
);

export default UserStore;
