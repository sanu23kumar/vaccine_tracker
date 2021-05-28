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

export const filterCenters = (centers: Center[], filters: Filter[]) => {
  // Populate filteredCetners with all centers for each filter
  const filteredCenters = new Array<Center[]>(filters.length).fill(centers);
  centers.forEach((center, centerIndex) =>
    center.sessions.forEach((session, sessionIndex) => {
      filters.forEach((filter, filterIndex) => {
        const isAvailable =
          !filter.availability || session[filter.availability] > 0;
        const isAgeCompliant =
          !filter.min_age_limit ||
          session.min_age_limit === filter.min_age_limit;
        const isVaccineCompliant =
          !filter.vaccine || session.vaccine === filter.vaccine;
        const isValid = isAvailable && isAgeCompliant && isVaccineCompliant;

        // Remove a session if it's not valid
        if (!isValid)
          filteredCenters[filterIndex][centerIndex].sessions.splice(
            sessionIndex,
            1,
          );

        // This is the last filter so remove centers with no sessions
        if (filterIndex === filters.length - 1)
          filteredCenters[filterIndex].filter(
            center => center.sessions.length > 0,
          );
      });
    }),
  );
  return filteredCenters;
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
