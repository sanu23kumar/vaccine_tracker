export interface District {
  state_id: number;
  district_id: number;
  district_name: string;
  district_name_l: string;
}

export interface DistrictsResponse {
  districts: District[];
  ttl: number;
}
