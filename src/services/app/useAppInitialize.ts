import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import useLocation from '../location/useLocation';
import { initialLocation, LOCATION } from '../models/user';
import { useUserStore } from '../stores';

const useAppInitialize = () => {
  const { postalCode, isLoading, getLocation } = useLocation();
  const { data, setData } = useUserStore();
  if (data) SplashScreen.hide();
  console.log('Data from store, ', data, postalCode);
  useEffect(() => {
    if (!data) {
      getLocation();
    }
  }, []);
  useEffect(() => {
    if (!data) {
      if (isLoading === 0) {
        if (postalCode) {
          setData({
            location: {
              name: postalCode,
              code: parseInt(postalCode),
              type: LOCATION.PIN,
            },
          });
        } else {
          setData({ location: initialLocation });
        }
      }
    }
  }, [isLoading]);
  return data;
};

export default useAppInitialize;
