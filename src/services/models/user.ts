export const LOCATION_TYPE_PIN = 'pin';
export const LOCATION_TYPE_DISTRICT = 'district';
export interface Location {
  name: string;
  code: number;
  type: string;
}

export const initialLocation: Location = {
  name: 'New Delhi',
  code: 140,
  type: 'district',
};

export interface UserModel {
  location: Location;
}

export const initialUser: UserModel = {
  location: initialLocation,
};
