import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import WorkManager from 'react-native-background-worker';
import PushNotification from 'react-native-push-notification';
import { filterCenters, findAvailableSlots } from '.';
import { STORE_KEY } from '../root';
import { AVAILABILITY, CentersResponse } from './models/centers';
import { Filter, FILTER_KEYS, NotificationFilter } from './models/filters';
import { STORE_FILTER_KEY } from './stores';

export const createLocalNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title,
    message,
    smallIcon: 'ic_notification',
  });
};

const parseCentersAndNotify = (response: CentersResponse, filter: Filter) => {
  console.log('Parsing centers');
  const validCenters = filterCenters(response.centers, filter);
  let availableSlots = 0;
  const firstHitDate = validCenters[0].sessions[0].date;
  validCenters.forEach(center =>
    center.sessions.filter(session => {
      availableSlots += session[AVAILABILITY.AVAILABLE];
      return session.date === firstHitDate;
    }),
  );
  console.log('Valid centers', validCenters);
  if (validCenters.length > 0) {
    createLocalNotification(
      'Jalandhar 45+',
      validCenters.length +
        (validCenters.length > 1 ? ' Centers' : ' Center') +
        ' found matching your request\n' +
        availableSlots +
        ' slots, Book Now 🎉',
    );
  } else {
    createLocalNotification(
      'No center administring vaccines in your area',
      `Don't worry we'll keep you notified`,
    );
  }
};

const fetchCenters = async () => {
  console.log('Fetching centers');
  const dataString = await AsyncStorage.getItem(STORE_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const filterData: NotificationFilter[] =
    asyncData[STORE_FILTER_KEY].notifications;
  for (const filter of filterData) {
    const response = await findAvailableSlots(
      filter[FILTER_KEYS.LOCATION].code,
      filter[FILTER_KEYS.DATE],
      filter[FILTER_KEYS.LOCATION].type,
    );
    parseCentersAndNotify(response[FILTER_KEYS.DATE], filter);
  }
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
      workflow: fetchCenters,
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
