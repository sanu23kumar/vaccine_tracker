export interface State {
  state_id: number;
  state_name: string;
  state_name_l: string;
}

export interface StatesResponse {
  states: State[];
  ttl: number;
}
