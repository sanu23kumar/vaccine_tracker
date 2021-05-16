import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import WorkManager from 'react-native-background-worker';
import PushNotification from 'react-native-push-notification';
import { findCalendarByPin } from '.';
import { USER_DATA_KEY } from '../store/user';
import { getDate } from './date';
import { CentersResponse } from './models/centers';

export const createLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title,
    message,
    smallIcon: 'ic_notification',
  });
};

const parseCentersAndNotify = (response: CentersResponse) => {
  const validCenters = response.centers.filter(
    center =>
      center.sessions.filter(session => session.available_capacity > 0).length >
      0,
  );
  if (validCenters.length > 0) {
    createLocalNotification(
      'Centers administrings vaccines updated!',
      JSON.stringify(validCenters[0]),
    );
  } else {
    createLocalNotification(
      'No center administring vaccines in your area',
      `Don't worry we'll keep you notified`,
    );
  }
};

const fetchCenters = async () => {
  const dataString = await AsyncStorage.getItem(USER_DATA_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const response = await findCalendarByPin(asyncData.postalCode, getDate());
  return response;
};

async function setUpdater() {
  const updaterId = await WorkManager.setWorker(
    /*periodic worker:*/ {
      type: 'periodic',
      name: 'vaccine_tracker',
      notification: {
        title: 'Fetching vaccination centers',
        text: 'Don`t worry, we will keep you updated',
      },
      workflow: async () => {
        const response = await fetchCenters();
        parseCentersAndNotify(response);
      },
      foregroundBehaviour: 'foreground',
      constraints: {
        network: 'connected',
      },
    },
  );
  return updaterId;
}

const useBackgroundFetch = () => {
  useEffect(() => {
    setUpdater();
  }, []);
};

export default useBackgroundFetch;
