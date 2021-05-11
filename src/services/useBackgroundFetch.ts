import {useContext, useEffect} from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import {useNotification} from '../notifications/createNotificationProvider';
import {UserContext} from '../store/user';
import {CentersResponseModel} from './centers/model';
import {getDate} from './date';
import {baseUrl} from './useVtFetch';

const useBackgroundFetch = () => {
  const {
    data: {postalCode},
  } = useContext(UserContext);
  const {createNotification} = useNotification();
  useEffect(() => {
    initBackgroundFetch();
  }, []);
  const initBackgroundFetch = async () => {
    const onEvent = async (taskId: string) => {
      console.log('[BackgroundFetch] task: ', taskId);

      const response: CentersResponseModel = await fetch(
        baseUrl +
          `/v2/appointment/sessions/public/calendarByPin?pincode=${postalCode}&date=${getDate()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'user-agent':
              'application-name/1.6.7.42 Dalvik/2.1.0 (Linux; U; Android 5.1.1; Android SDK built for x86 Build/LMY48X)',
          },
        },
      ).then(res => res.json());

      parseCentersAndNotify(response);
      console.log('[BackgroundFetch] centers fetched: ', response);
      BackgroundFetch.finish(taskId);
    };

    const onTimeout = async taskId => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    };

    let status = await BackgroundFetch.configure(
      {minimumFetchInterval: 15},
      onEvent,
      onTimeout,
    );

    console.log('[BackgroundFetch] configure status: ', status);
  };

  const parseCentersAndNotify = (response: CentersResponseModel) => {
    const validCenters = response.centers.filter(
      center =>
        center.sessions.filter(session => session.available_capacity > 0)
          .length > 0,
    );
    if (validCenters.length > 0) {
      createNotification(
        'Centers administrings vaccines updated!',
        JSON.stringify(validCenters[0]),
      );
    } else {
      createNotification(
        'No center administring vaccines in your area',
        `Don't worry we'll keep you notified`,
      );
    }
  };
};

export default useBackgroundFetch;
