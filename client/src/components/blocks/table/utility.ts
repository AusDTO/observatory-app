export const numberWithCommas = (x: any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const shortenString = (text: string, characters: number) => {
  return text.length > characters
    ? text.substring(0, characters) + "..."
    : text;
};
