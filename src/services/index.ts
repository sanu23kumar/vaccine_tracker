import {
  BASE_URL,
  CONFIRM_OTP,
  GENERATE_OTP,
  GET_DISTRICTS,
  GET_SESSIONS_CALENDAR,
  GET_SESSIONS_CALENDAR_BY_PIN,
  GET_SESSIONS_FIND_BY_PIN,
  GET_STATES,
} from './endpoints';
import { CentersResponse, SessionsResponse } from './models/centers';
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

export const findCalendarByPin = (pincode: string, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR_BY_PIN + `${pincode}&date=${date}`,
  );

export const findByPin = (pincode: string, date: string) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_FIND_BY_PIN + `${pincode}&date=${date}`,
  );

export const findByDistrict = (
  district_id: string,
  date: string,
  showCalendar = false,
) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS_CALENDAR +
      `${
        showCalendar ? 'calendarByDistrict' : 'findByDistrict'
      }?district_id=${district_id}&date=${date}`,
  );

export const findAvailableSlots = async (
  district_id: string,
  date: string,
  expandDates = false,
  filters = {},
) => {
  const centres = await findByDistrict(district_id, date, true);
  let validCenters = centres.centers.filter(
    center =>
      center.sessions.filter(session => session.available_capacity > 0).length >
      0,
  );

  if (filters) {
    for (let filter in filters) {
      validCenters = validCenters.filter(
        center =>
          center.sessions.filter(session => session[filter] === filters[filter])
            .length > 0,
      );
    }
  }

  return validCenters;
};

export const testFn = async () => {
  const response = await getAllDistricts();
  console.log(response);
  console.log(JSON.stringify(response));
};
