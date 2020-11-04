import { TickFormatterFunction } from "recharts";

const months: Array<string> = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const times: Array<string> = [
  "12am",
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
  "11pm",
];
const days: Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//REFACTOR May become redundant once data stream is updated

const formatDate: TickFormatterFunction = (date) => {
  const date_obj: Date = new Date(date);
  const month: any = date_obj.getMonth();
  return `${date_obj.getDate()} ${months[month]}`;
};

const formatDateWithDay: TickFormatterFunction = (date) => {
  const date_obj: Date = new Date(date);
  const month: any = date_obj.getMonth();
  const day: any = days[date_obj.getDay()];
  return `${day} ${date_obj.getDate()} ${months[month]}`;
};

const formatHour: TickFormatterFunction = (hour) => {
  return times[hour];
};

export { formatDate, formatHour, formatDateWithDay };
