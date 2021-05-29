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
export interface Session {
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
  session_id: string;
  date: string;
  [AVAILABILITY.AVAILABLE]: number;
  min_age_limit: AGE_LIMIT;
  vaccine: VACCINE;
  slots: string[];
  [AVAILABILITY.DOSE_1]: number;
  [AVAILABILITY.DOSE_2]: number;
}

export interface VaccineFee {
  vaccine: string;
  fee: string;
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
  vaccine_fees: VaccineFee[];
  sessions: Session[];
}

export interface CentersResponse {
  centers: Center[];
}

export interface CentersResponseByDate {
  [date: string]: CentersResponse;
}
