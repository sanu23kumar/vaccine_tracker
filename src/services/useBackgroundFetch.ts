import VIForegroundService from '@voximplant/react-native-foreground-service';
import { useEffect } from 'react';
import usePrevious from '../utils/usePrevious';
import { InitialPreferences } from './models/user';
import { usePreferencesStore } from './stores';

const foregroundChannelConfig = {
  id: 'foreground-service-channel',
  name: 'Foreground Channel',
  description: 'Fetches centres in the aread in the foreground',
  enableVibration: false,
};

const notificationConfig = {
  channelId: 'foreground-service-channel',
  id: 999999,
  title: 'VaxIN',
  text: 'Looking for centers in your area',
  icon: 'ic_notification',
};

const startForegroundService = async (
  interval = InitialPreferences.interval,
) => {
  try {
    await VIForegroundService.startService({
      ...notificationConfig,
      WORK_INTERVAL: interval,
    });
  } catch (e) {
    console.error(e);
  }
};

const restartForegroundService = async (interval: number) => {
  try {
    await VIForegroundService.stopService();
  } catch (e) {
    console.error(e);
  }
  try {
    await VIForegroundService.startService({
      ...notificationConfig,
      WORK_INTERVAL: interval,
    });
  } catch (e) {
    console.error(e);
  }
};
const useBackgroundFetch = () => {
  const interval = usePreferencesStore()?.data?.preferences?.interval;

  const oldInterval = usePrevious(interval);

  useEffect(() => {
    VIForegroundService.createNotificationChannel(foregroundChannelConfig);
    if (oldInterval === interval) {
      startForegroundService(interval);
    } else {
      restartForegroundService(interval);
    }
  }, [interval]);
};

export default useBackgroundFetch;
