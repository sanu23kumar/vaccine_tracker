import AsyncStorageMobile from '@react-native-community/async-storage';
import React, { Context, ReactNode, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const AsyncStorage = Platform.OS === 'web' ? localStorage : AsyncStorageMobile;

interface Props<T> {
  storeKey: string;
  initData: T;
  context: Context<T>;
  children: ReactNode;
}

const CgStore = <T extends object>({
  storeKey,
  initData,
  context,
  children
}: Props<T>) => {
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [data, setData] = useState<T>(initData);

  const getDataFromAsync = async () => {
    let asyncData;
    try {
      const dataString = await AsyncStorage.getItem(storeKey);
      asyncData = dataString && (await JSON.parse(dataString));
      console.log(storeKey, 'Data fetched from async', asyncData);
      if (asyncData) setData(asyncData);
      setDataRetrieved(true);
    } catch (error) {
      console.error(error);
    }
    return asyncData;
  };

  const setDataToStore = async (newData: T) => {
    try {
      const updatedData = { ...data, ...newData };
      setData(updatedData);
      const dataString = JSON.stringify(updatedData);
      await AsyncStorage.setItem(storeKey, dataString);
      console.log(storeKey, 'Data updated', newData);
    } catch (error) {
      console.error(error);
    }
  };

  const setAbsoluteDataToStore = async (newData: T) => {
    try {
      const updatedData = newData;
      setData(updatedData);
      const dataString = JSON.stringify(updatedData);
      await AsyncStorage.setItem(storeKey, dataString);
      // console.log('Data updated', updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  const removeData = async () => {
    await setDataToStore(initData);
  };

  useEffect(() => {
    getDataFromAsync();
  }, []);

  return (
    <context.Provider
      value={{ data, removeData, setDataToStore, setAbsoluteDataToStore }}
    >
      {dataRetrieved && children}
    </context.Provider>
  );
};

export default CgStore;