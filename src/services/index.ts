import { getDate } from './date';
import {
  BASE_URL,
  CONFIRM_OTP,
  GENERATE_OTP,
  GET_DISTRICTS,
  GET_SESSIONS_CALENDAR_BY_PIN,
  GET_SESSIONS_CALENDAR,
  GET_SESSIONS_FIND_BY_PIN,
  GET_STATES,
} from './endpoints';
import { CentersResponse, Center } from './models/centers';
import { DistrictsResponse } from './models/districts';
import { GenerateOtpResponse, ValidateOtpResponse } from './models/otp';
import { StatesResponse } from './models/states';

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
      var { centers } = await findByDistrict(district.district_id, date, false);
      centers.forEach(function (center) {
        delete center.sessions;
      });
      states[s_index].districts[d_index].centers = centers;
    }
  }

  return states;
};

export const findCalendarByPin = (pincode: string, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR_BY_PIN + `${pincode}&date=${date}`,
  );

export const findByPin = (pincode: string, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_FIND_BY_PIN + `${pincode}&date=${date}`,
  );

export const findByDistrict = (
  district_id: number,
  date: string,
  showCalendar = true,
) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR +
      `${
        showCalendar ? 'calendarByDistrict' : 'findByDistrict'
      }?district_id=${district_id}&date=${date}`,
  );

export const filterCenters = async (
  centers: Center[],
  filters = { center: {}, session: {} },
) => {
  let validCenters = centers.filter(
    center =>
      center.sessions.filter(session => session.available_capacity > 0).length >
      0,
  );

  if (filters.center) {
    for (let filter in filters.center) {
      validCenters = validCenters.filter(
        center => !center[filter] || filters[filter].includes(center[filter]),
      );
    }
  }

  if (filters.session) {
    for (let filter in filters.session) {
      validCenters = validCenters.filter(
        center =>
          center.sessions.filter(
            session =>
              !session[filter] || filters[filter].includes(session[filter]),
          ).length > 0,
      );
    }
  }

  return validCenters;
};

export const findAvailableSlots = async (
  district_id: number,
  date: string,
  expandDates = false,
  filters = { center: {}, session: {} },
) => {
  const validCenters = [];
  var requestCounter = 0;
  do {
    const { centers } = await findByDistrict(district_id, date, true);
    requestCounter++;
    if (centers) {
      validCenters.push(filterCenters(centers, filters));
      // date = add 7 days to date
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
