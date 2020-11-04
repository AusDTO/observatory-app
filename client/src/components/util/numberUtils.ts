import moment from "moment";

export const stringNumToCommaSeperated = (number: string) => {
  let num;
  num = parseInt(number);
  if (isNaN(num)) {
    return "NaN";
  } else return num.toLocaleString();
};

export const SubtringTen = (value: string) => {
  return value.length > 20 ? value.substring(0, 20) + "..." : value;
};

export const roundTwoPlaces = (number: string) => {
  let num;
  num = parseInt(number);
  if (isNaN(num)) {
    return "NaN";
  } else return Math.round(num).toLocaleString();
};

export const secondsToMinutes = (sec: string) => {
  const seconds = parseInt(sec);
  var m = Math.floor((seconds % 3600) / 60).toString(),
    s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return m + "mins " + s + " secs";
};
