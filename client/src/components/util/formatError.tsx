import React from "react";

export const formatApiError = (errors: ApiError[]) => {
  return errors.map((error, index: number) => (
    <li key={index}>
      <a href={`#${error.path}`}>
        {error.path.toLocaleUpperCase()}: {error.message}
      </a>
    </li>
  ));
};
