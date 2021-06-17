import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmClock from 'react-native-alarm-clock';
import PushNotification from 'react-native-push-notification';
import { STORE_KEY } from './src/root';
import { findAvailableSlotsToNotify } from './src/services';
import { FILTER_KEYS } from './src/services/models/filters';
import { PREFERENCES_STORE_KEY, STORE_FILTER_KEY } from './src/services/stores';

const createLocalNotification = (title, message, filter, isAlarmEnabled) => {
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
  if (true) {
    try {
      let date = new Date();
      date.setDate(date.getDate());
      date.setHours(date.getHours(), date.getMinutes() + 1);
      AlarmClock.createAlarm(date.toISOString(), 'VaxIN ' + message);
    } catch (e) {
      console.log(e);
    }
  }
};

const fetchCenters = async notifications => {
  const dataString = await AsyncStorage.getItem(STORE_KEY);
  const asyncData = dataString && (await JSON.parse(dataString));
  const filterData = asyncData[STORE_FILTER_KEY].notifications;
  const isAlarmEnabled =
    asyncData[PREFERENCES_STORE_KEY]?.preferences?.isAlarmEnabled;

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
        isAlarmEnabled,
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
