import { AGE_LIMIT, AVAILABILITY, FEE_TYPE, VACCINE } from './centers';

export enum FILTER_KEYS {
  MIN_AGE_LIMIT = 'min_age_limit',
  VACCINE = 'vaccine',
  AVAILABILITY = 'availability',
  FEE_TYPE = 'fee_type',
}
export interface Filter {
  [FILTER_KEYS.MIN_AGE_LIMIT]?: AGE_LIMIT;
  [FILTER_KEYS.VACCINE]?: VACCINE;
  [FILTER_KEYS.AVAILABILITY]?: AVAILABILITY;
  [FILTER_KEYS.FEE_TYPE]?: FEE_TYPE;
}
