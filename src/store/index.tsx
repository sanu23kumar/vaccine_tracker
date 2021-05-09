import React from 'react';
import UserStore from './user';

const Store = ({children}: {children: any}) => {
  return <UserStore>{children}</UserStore>;
};

export default Store;
