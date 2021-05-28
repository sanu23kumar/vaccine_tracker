import { Session } from './centers';

export enum AGE_LIMIT {
  MIN_18 = 18,
  MIN_45 = 45,
}

export enum VACCINE {
  COVAXIN = 'COVAXIN',
  COVISHIELD = 'COVISHIELD',
  SPUTNIK = 'SPUTNIK',
}

export enum AVAILABILITY {
  AVAILABLE = 'available_capacity',
  DOSE_1 = 'available_capacity_dose1',
  DOSE_2 = 'available_capacity_dose2',
}

export interface Filter {
  min_age_limit?: AGE_LIMIT;
  vaccine?: VACCINE;
  availability?: AVAILABILITY;
}
