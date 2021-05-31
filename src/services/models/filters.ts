import { AGE_LIMIT, AVAILABILITY, FEE_TYPE, VACCINE } from './centers';
import { Location } from './user';

export enum FILTER_KEYS {
  MIN_AGE_LIMIT = 'min_age_limit',
  VACCINE = 'vaccine',
  AVAILABILITY = 'availability',
  FEE_TYPE = 'fee_type',
  NAME = 'notification_name',
  LOCATION = 'location',
  DATE = 'date',
  ENABLED = 'enabled',
  NOTIFICATION_ID = 'notification_id',
}
export interface Filter {
  [FILTER_KEYS.MIN_AGE_LIMIT]?: AGE_LIMIT;
  [FILTER_KEYS.VACCINE]?: VACCINE;
  [FILTER_KEYS.AVAILABILITY]?: AVAILABILITY;
  [FILTER_KEYS.FEE_TYPE]?: FEE_TYPE;
}

export interface NotificationFilter extends Filter {
  [FILTER_KEYS.NOTIFICATION_ID]: number;
  [FILTER_KEYS.NAME]: string;
  [FILTER_KEYS.LOCATION]: Location;
  [FILTER_KEYS.DATE]: string;
  [FILTER_KEYS.ENABLED]: boolean;
}

export const initialFilter: Filter = {};
