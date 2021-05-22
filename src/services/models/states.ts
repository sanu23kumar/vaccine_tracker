import { District } from './districts';

export interface State {
  state_id: number;
  state_name: string;
  state_name_l: string;
  districts?: District[];
}

export interface StatesResponse {
  states: State[];
  ttl: number;
}
