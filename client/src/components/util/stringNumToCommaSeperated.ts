export const stringNumToCommaSeperated = (number: string) => {
  let num;
  num = parseInt(number);
  if (isNaN(num)) {
    return "NaN";
  } else return num.toLocaleString();
};
