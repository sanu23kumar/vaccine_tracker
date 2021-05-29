import { addDays } from './date';
import {
  BASE_URL,
  CONFIRM_OTP,
  GENERATE_OTP,
  GET_DISTRICTS,
  GET_SESSIONS_CALENDAR_BY_DISTRICT,
  GET_SESSIONS_CALENDAR_BY_PIN,
  GET_STATES,
} from './endpoints';
import {
  Center,
  CentersResponse,
  CentersResponseByDate,
  Session,
} from './models/centers';
import {
  DistrictsResponse,
  STATES_WITH_DISTRICTS,
  SuggestDistrictResponse,
} from './models/districts';
import { Filter } from './models/filters';
import { GenerateOtpResponse, ValidateOtpResponse } from './models/otp';
import { StatesResponse } from './models/states';
import { LOCATION } from './models/user';

export const suggestDistricts = (prefix: string): SuggestDistrictResponse[] => {
  let beginMatch = [];
  let wordMatch = [];
  let beginMatchRegex = new RegExp('^' + prefix, 'gi');
  let wordMatchRegex = new RegExp('\\b' + prefix, 'gi');
  for (const state of STATES_WITH_DISTRICTS) {
    for (const district of state.districts) {
      if (beginMatchRegex.test(district.district_name)) {
        beginMatch.push({ ...district, ...state, districts: undefined });
      } else if (wordMatchRegex.test(district.district_name)) {
        wordMatch.push({ ...district, ...state, districts: undefined });
      }
    }
  }

  return [...beginMatch, ...wordMatch];
};

export const cowinAPI = <T>(
  uri: string,
  method = 'GET',
  body = null,
): Promise<T> =>
  fetch(BASE_URL + uri, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'user-agent':
        'VaccineTracker/1.6.7.42 Dalvik/2.1.0 (Linux; U; Android 5.1.1; Android SDK built for x86 Build/LMY48X)',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(response => response.json());

export const generateOTP = (mobileNumber: string) =>
  cowinAPI<GenerateOtpResponse>(GENERATE_OTP, 'POST', { mobile: mobileNumber });

export const confirmOTP = (otp: string, tnxId: string) =>
  cowinAPI<ValidateOtpResponse>(CONFIRM_OTP, 'POST', {
    otp: otp,
    tnxId: tnxId,
  });

export const getStates = () => cowinAPI<StatesResponse>(GET_STATES);

export const getDistrict = (stateid: number) =>
  cowinAPI<DistrictsResponse>(GET_DISTRICTS + stateid);

export const getAllDistricts = async () => {
  const { states } = await getStates();

  for (let [index, state] of states.entries()) {
    let { districts } = await getDistrict(state.state_id);
    states[index].districts = districts;
  }

  return states;
};

export const getAllCentres = async (date: string, sleep: number = 5000) => {
  const states = await getAllDistricts();
  for (let [s_index, state] of states.entries()) {
    for (let [d_index, district] of state.districts.entries()) {
      var { centers } = await findByDistrict(district.district_id, date);
      centers.forEach(function (center) {
        delete center.sessions;
      });
      states[s_index].districts[d_index].centers = centers;
    }
  }

  return states;
};

const findByPin = (pincode: number, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR_BY_PIN + `${pincode}&date=${date}`,
  );

const findByDistrict = (district_id: number, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR_BY_DISTRICT + `${district_id}&date=${date}`,
  );

export const filterCenters = (centers: Center[], filters: Filter) => {
  const checkIfValidSession = (session: Session) => {
    const isAvailable =
      !filters.availability || session[filters.availability] > 0;

    const isAgeCompatible =
      !filters.min_age_limit || filters.min_age_limit === session.min_age_limit;

    const isVaccineCompatible =
      !filters.vaccine || filters.vaccine === session.vaccine;

    return isAvailable && isAgeCompatible && isVaccineCompatible;
  };
  const validCenters = centers.filter(
    center => center.sessions.filter(checkIfValidSession).length > 0,
  );
  console.log('Filter', filters, 'Valid centers: ', validCenters);
  return validCenters;
};

export const findAvailableSlots = async (
  code: number,
  date: string,
  type: LOCATION,
  expandDates = false,
) => {
  const validCenters: CentersResponseByDate = {};
  var requestCounter = 0;
  const findBy = type === LOCATION.DISTRICT ? findByDistrict : findByPin;
  do {
    const { centers } = await findBy(code, date);
    requestCounter++;
    if (centers) {
      validCenters[date] = { centers };
      date = addDays(date, 7);
    } else {
      expandDates = false;
    }
  } while (expandDates || requestCounter === 15);

  return validCenters;
};

export const testFn = async () => {
  const response = await getAllDistricts();
  console.log(response);
  console.log(JSON.stringify(response));
};
