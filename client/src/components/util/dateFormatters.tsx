const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getDayFromDate = (dateString: string) => {
  const newDate = new Date(dateString);
  const day: number = newDate.getDay();
  const date: number = newDate.getDate();
  const month: number = newDate.getMonth();

  return `${days[day]} ${date} ${months[month]}`;
};
