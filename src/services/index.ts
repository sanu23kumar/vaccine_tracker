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
  body = {},
): Promise<T> =>
  fetch(BASE_URL + uri, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
    },
    body: JSON.stringify(body),
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
