export const getDate = () => {
  const today = new Date();
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
