import { getDate } from '../date';
import { NotificationFilter } from './filters';

export enum LOCATION {
  PIN = 'pin',
  DISTRICT = 'district',
}
export interface Location {
  name: string;
  code: number;
  type: LOCATION;
}

export const initialLocation: Location = {
  name: 'New Delhi',
  code: 140,
  type: LOCATION.DISTRICT,
};

export interface Preferences {
  interval: number;
  isAlarmEnabled: boolean;
}

export const InitialPreferences = {
  interval: __DEV__ ? 10000 : 900000,
  isAlarmEnabled: false,
};

export interface UserModel {
  filter: NotificationFilter;
}

export const initialUser: UserModel = {
  filter: { date: getDate(), location: initialLocation },
};
