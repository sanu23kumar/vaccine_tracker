import { AGE_LIMIT, AVAILABILITY, VACCINE } from './centers';
export interface Filter {
  min_age_limit?: AGE_LIMIT;
  vaccine?: VACCINE;
  availability?: AVAILABILITY;
}
