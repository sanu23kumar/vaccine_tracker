import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { STORE_KEY } from './src/root';
import { findAvailableSlotsToNotify } from './src/services';
import { FILTER_KEYS } from './src/services/models/filters';
import { STORE_FILTER_KEY } from './src/services/stores';

const createLocalNotification = (title, message, filter) => {
  PushNotification.localNotification({
    channelId: 'slots-availability',
    title,
    message,
    smallIcon: 'ic_notification',
    userData: { filter },
    soundName: 'slot_alert.wav',
    id: filter[FILTER_KEYS.NOTIFICATION_ID],
    ignoreInForeground: __DEV__ ? false : true,
  });
};

const fetchCenters = async notifications => {
  const dataString = await AsyncStorage.getItem(STORE_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const filterData = asyncData[STORE_FILTER_KEY].notifications;

  for (const filter of filterData) {
    if (!filter.enabled) {
      continue;
    }
    if (
      notifications.findIndex(
        notification =>
          notification.identifier ===
          filter[FILTER_KEYS.NOTIFICATION_ID].toString(),
      ) > -1
    ) {
      continue;
    }
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

const CentresTask = async () => {
  PushNotification.getDeliveredNotifications(notifications =>
    fetchCenters(notifications),
  );
};

export default CentresTask;
