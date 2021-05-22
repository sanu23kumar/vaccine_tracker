export interface Session {
  session_id: string;
  date: string;
  available_capacity: number;
  min_age_limit: number;
  vaccine: string;
  slots: string[];
  available_capacity_dose1: number;
  available_capacity_dose2: number; 
}

export interface Center {
  center_id: number;
  name: string;
  address: string;
  state_name: string;
  district_name: string;
  block_name: string;
  pincode: number;
  lat: number;
  long: number;
  from: string;
  to: string;
  fee_type: string;
  sessions: Session[];
}

export interface CentersResponse {
  centers: Center[];
}
