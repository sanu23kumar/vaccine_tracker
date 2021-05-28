import { Center, Session } from './centers';

export interface Filter {
  session: Session;
  availability: 'available_capacity_dose1' | 'available_capacity_dose2';
}
