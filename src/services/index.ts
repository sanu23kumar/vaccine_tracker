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
  AVAILABILITY,
  Center,
  CentersResponse,
  CentersResponseByDate,
  Session,
} from './models/centers';
import { DistrictsResponse, SuggestDistrictResponse } from './models/districts';
import { Filter, FILTER_KEYS, NotificationFilter } from './models/filters';
import { GenerateOtpResponse, ValidateOtpResponse } from './models/otp';
import { StatesResponse } from './models/states';
import { LOCATION } from './models/user';

export const suggestDistricts = (
  prefix: string,
  states,
): SuggestDistrictResponse[] => {
  let beginMatch = [];
  let wordMatch = [];
  let beginMatchRegex = new RegExp('^' + prefix, 'gi');
  let wordMatchRegex = new RegExp('\\b' + prefix, 'gi');
  for (const state of states) {
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
  const checkIfValidSession = (session: Session, center: Center) => {
    const isAvailable =
      !filters[FILTER_KEYS.AVAILABILITY] ||
      session[filters[FILTER_KEYS.AVAILABILITY]] > 0;

    const isAgeCompatible =
      !filters[FILTER_KEYS.MIN_AGE_LIMIT] ||
      filters[FILTER_KEYS.MIN_AGE_LIMIT] === session[FILTER_KEYS.MIN_AGE_LIMIT];

    const isVaccineCompatible =
      !filters[FILTER_KEYS.VACCINE] ||
      filters[FILTER_KEYS.VACCINE] === session[FILTER_KEYS.VACCINE];

    const isFeeCompatible =
      !filters[FILTER_KEYS.FEE_TYPE] ||
      filters[FILTER_KEYS.FEE_TYPE] === center[FILTER_KEYS.FEE_TYPE];

    return (
      isAvailable && isAgeCompatible && isVaccineCompatible && isFeeCompatible
    );
  };
  let validCenters: Center[] = JSON.parse(JSON.stringify(centers));
  validCenters = validCenters.filter(center => {
    center.sessions = center.sessions.filter(session =>
      checkIfValidSession(session, center),
    );
    return center.sessions.length > 0;
  });
  return validCenters;
};

export const findAvailableSlots = async (
  code: number,
  date: string,
  type: LOCATION,
) => {
  const validCenters: CentersResponseByDate = {};
  var requestCounter = 0;
  const findBy = type === LOCATION.DISTRICT ? findByDistrict : findByPin;
  const { centers } = await findBy(code, date);
  requestCounter++;
  if (centers) {
    validCenters[date] = { centers };
  }
  console.log('Result of ', ' is: ', date, code, validCenters);
  return validCenters;
};

export const findAvailableSlotsToNotify = async (
  filters: NotificationFilter,
) => {
  const validCenters: CentersResponseByDate = {};
  let firstHitDate = undefined;
  let requestCounter = 0;
  let availableSlots = 0;
  let availableCenters = 0;
  let requestDate = filters.date;
  let expandDates = true;
  const findBy =
    filters.location.type === LOCATION.DISTRICT ? findByDistrict : findByPin;
  do {
    const { centers } = await findBy(filters.location.code, filters.date);
    requestCounter++;
    if (centers) {
      validCenters[requestDate] = { centers: filterCenters(centers, filters) };
      if (validCenters[requestDate].centers.length !== 0) {
        expandDates = false;
        firstHitDate = validCenters[requestDate].centers[0].sessions[0].date;
        validCenters[requestDate].centers.forEach(center => {
          const sessions = center.sessions.filter(session => {
            const isOfSameDate = session.date === firstHitDate;
            if (isOfSameDate) availableSlots += session[AVAILABILITY.AVAILABLE];
            return isOfSameDate;
          });
          if (sessions.length > 0) availableCenters++;
        });
      } else {
        requestDate = addDays(requestDate, 7);
      }
    } else {
      expandDates = false;
    }
  } while (expandDates || requestCounter === 15);
  console.log(
    'Result of ',
    filters,
    ' is: ',
    requestDate,
    firstHitDate,
    availableSlots,
    validCenters,
  );
  return { firstHitDate, availableSlots, availableCenters };
};

export const testFn = async () => {
  const response = await getAllDistricts();
  console.log(response);
  console.log(JSON.stringify(response));
};
