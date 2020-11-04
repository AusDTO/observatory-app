import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export const percentageWithSign = (value: string) => {
  let num;
  num = parseInt(value);
  if (isNaN(num)) {
    return "NaN";
  }
  return num < 0 ? (
    <>
      <FaArrowDown fontSize="0.85em" color="red" transform="rotate(-45)" />
      <span className="percentage-number">{`${value.replace("-", "")}`}</span>
    </>
  ) : (
    <>
      <FaArrowUp transform="rotate(45)" color="green" fontSize="0.85em" />
      <span className="percentage-number">{value}</span>
    </>
  );
};
