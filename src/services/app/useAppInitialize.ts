import { useEffect } from 'react';
import useLocation from '../location/useLocation';
import { initialLocation, LOCATION } from '../models/user';
import { useUserStore } from '../stores';

const useAppInitialize = () => {
  const { postalCode, isLoading, getLocation } = useLocation();
  const { data, setData } = useUserStore();

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
            filter: {
              location: {
                name: postalCode,
                code: parseInt(postalCode),
                type: LOCATION.PIN,
              },
            },
          });
        } else {
          setData({ filter: { location: initialLocation } });
        }
      }
    }
  }, [isLoading]);
  return data;
};

export default useAppInitialize;
