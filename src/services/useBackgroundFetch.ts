import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import WorkManager from 'react-native-background-worker';
import PushNotification from 'react-native-push-notification';
import { findAvailableSlotsToNotify } from '.';
import { STORE_KEY } from '../root';
import { FILTER_KEYS, NotificationFilter } from './models/filters';
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
    id: filter[FILTER_KEYS.NOTIFICATION_ID],
    ignoreInForeground: __DEV__ ? false : true,
  });
};

const fetchCenters = async (notifications: any[]) => {
  console.log('Delivered notifications are', notifications);
  const dataString = await AsyncStorage.getItem(STORE_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const filterData: NotificationFilter[] =
    asyncData[STORE_FILTER_KEY].notifications;

  for (const filter of filterData) {
    if (!filter.enabled) continue;
    if (
      notifications.findIndex(
        notification =>
          notification.identifier ===
          filter[FILTER_KEYS.NOTIFICATION_ID].toString(),
      ) > -1
    ) {
      console.log('Notification ', filter, ' already exists');
      continue;
    }
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

const getDeliveredNotificationsAndFetchCenters = async () => {
  PushNotification.getDeliveredNotifications(notifications =>
    fetchCenters(notifications),
  );
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
      workflow: getDeliveredNotificationsAndFetchCenters,
      foregroundBehaviour: 'foreground',
      timeout: 60000,
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
