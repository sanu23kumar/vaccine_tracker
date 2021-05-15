import { getDate } from './date';
import {
  BASE_URL,
  CONFIRM_OTP,
  GENERATE_OTP,
  GET_DISTRICTS,
  GET_SESSIONS,
  GET_STATES,
} from './endpoints';
import { CentersResponse } from './models/centers';
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

const getStates = () => cowinAPI<StatesResponse>(GET_STATES);

export const getDistricts = (stateid: string) =>
  cowinAPI<DistrictsResponse>(GET_DISTRICTS + stateid);

export const findByPin = (
  pincode: string,
  date: string,
  showCalendar = false,
) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS +
      `${
        showCalendar ? 'calendarByPin' : 'findByPin'
      }?pincode=${pincode}&date=${date}`,
  );

export const findByDistrict = (
  district_id: string,
  date: string,
  showCalendar = false,
) =>
  cowinAPI<CentersResponse>(
    GET_SESSIONS +
      `${
        showCalendar ? 'calendarByDistrict' : 'findByDistrict'
      }?district_id=${district_id}&date=${date}`,
  );

export const findAvailableSlots = (
  district_id: string,
  date: string,
  filters = '',
  expandDates = false,
) => findByDistrict(district_id, date, true);

export const testFn = () => findAvailableSlots('650', getDate());
