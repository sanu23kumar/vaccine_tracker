import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import useLocation from '../location/useLocation';
import { STATES_WITH_DISTRICTS } from '../models/districts';
import { initialLocation, LOCATION } from '../models/user';
import { useDistrictsStore, useFilterStore, useUserStore } from '../stores';

const useAppInitialize = () => {
  const { postalCode, isLoading, getLocation } = useLocation();
  const { data, setData } = useUserStore();
  const { districtsData, setDistrictsData } = useDistrictsStore();
  const { notificationsData, setNotificationsData } = useFilterStore();
  if (data) SplashScreen.hide();

  useEffect(() => {
    if (!data) {
      getLocation();
    }
    if (!districtsData) {
      setDistrictsData({ states: STATES_WITH_DISTRICTS });
    }
    if (!notificationsData) {
      setNotificationsData({ notifications: [] });
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
  return data && districtsData;
};

export default useAppInitialize;
