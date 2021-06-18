import useStore from 'potli/useStore';
import { StatesModel, STATES_WITH_DISTRICTS } from './models/districts';
import { NotificationFilter } from './models/filters';
import { InitialPreferences, Preferences, UserModel } from './models/user';

export const STORE_USER_KEY = 'user';

export const useUserStore = () => {
  const { data, setData } = useStore<UserModel>(STORE_USER_KEY);
  return { data, setData };
};

export const STORE_FILTER_KEY = 'filters';

export const useFilterStore = () => {
  const { data, setData } = useStore<{ notifications: NotificationFilter[] }>(
    STORE_FILTER_KEY,
  );
  return { notificationsData: data, setNotificationsData: setData };
};

export const STATES_WITH_DISTRICTS_STORE_KEY = 'states_with_districts';

export const useDistrictsStore = () => {
  const { data, setData } = useStore<{ states: StatesModel[] }>(
    STATES_WITH_DISTRICTS_STORE_KEY,
  );
  return { districtsData: data, setDistrictsData: setData };
};

export const PREFERENCES_STORE_KEY = 'preferences_store_key';

export const usePreferencesStore = () => {
  const { data, setData } = useStore<{ preferences: Preferences }>(
    PREFERENCES_STORE_KEY,
  );
  return { data, setData };
};

export const initialStoreData = {
  [STATES_WITH_DISTRICTS_STORE_KEY]: { states: STATES_WITH_DISTRICTS },
  [STORE_FILTER_KEY]: { notifications: [] },
  [PREFERENCES_STORE_KEY]: { preferences: InitialPreferences },
};
