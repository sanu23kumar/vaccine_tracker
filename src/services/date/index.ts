export const getDate = (today = new Date()) => {
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  const dateString = dd + '-' + mm + '-' + yyyy;
  return dateString;
};

export const getUsDateFromIn = (date: string) => {
  const dateArray = date.split('-');
  const dateString = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
  return dateString;
};

export const getQueryDate = (date: string) => {
  const dd = parseInt(date.substr(0, 2));
  let newDD = Math.floor(dd / 7) * 7;
  if (newDD === 0) newDD = 1;
  const newDate = String(newDD).padStart(2, '0') + date.substr(2);
  return newDate;
};

export const addDays = (date: string, days: number) => {
  const usDate = getUsDateFromIn(date);
  var result = new Date(usDate);
  result.setDate(result.getDate() + days);
  return getUsDateFromIn(getDate(result));
};
