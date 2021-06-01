import { Filter } from './filters';

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

export interface UserModel {
  location: Location;
  filter: Filter;
}

export const initialUser: UserModel = {
  location: initialLocation,
};
