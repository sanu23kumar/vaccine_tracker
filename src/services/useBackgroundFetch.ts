import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import WorkManager from 'react-native-background-worker';
import PushNotification from 'react-native-push-notification';
import { findAvailableSlotsToNotify } from '.';
import { STORE_KEY } from '../root';
import { NotificationFilter } from './models/filters';
import { STORE_FILTER_KEY } from './stores';

export const createLocalNotification = (
  title: string,
  message: string,
  filter: NotificationFilter,
) => {
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title,
    message,
    smallIcon: 'ic_notification',
    userData: { filter },
  });
};

const fetchCenters = async () => {
  const dataString = await AsyncStorage.getItem(STORE_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const filterData: NotificationFilter[] =
    asyncData[STORE_FILTER_KEY].notifications;

  for (const filter of filterData) {
    if (!filter.enabled) continue;
    console.log(filter);
    const {
      firstHitDate,
      availableSlots,
      availableCenters,
    } = await findAvailableSlotsToNotify(filter);
    if (availableCenters > 0) {
      createLocalNotification(
        filter.notification_name ?? 'Update!',
        availableCenters +
          (availableCenters > 1 ? ' Centers' : ' Center') +
          ' found on ' +
          firstHitDate +
          '\n' +
          availableSlots +
          ' slots, Book Now 🎉',
        { ...filter, date: firstHitDate },
      );
    }
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
