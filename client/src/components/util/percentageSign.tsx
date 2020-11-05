import React from "react";
import { FaArrowUp, FaArrowDown, FaPlus, FaMinus } from "react-icons/fa";

export const percentageWithSign = (value: string) => {
  let num;
  num = parseInt(value);
  if (isNaN(num)) {
    return "NaN";
  }
  return num < 0 ? (
    <>
      <FaMinus fontSize="0.85em" aria-label="decreased" />
      <span className="percentage-number">{`${value.replace("-", "")}`}</span>
      <span className="au-sr-only">percent</span>
    </>
  ) : (
    <>
      <FaPlus fontSize="0.85em" />
      <span className="percentage-number">{value}</span>
      <span className="au-sr-only">percent</span>
    </>
  );
};
