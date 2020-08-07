import { ValidationError } from "yup";

//Takes errors from Yup validation schema and returns them in an array
export const formatYupError = (errors: ValidationError) => {
  const errorArray: Array<{ path: String; message: String }> = [];

  errors.inner.forEach((error) => {
    errorArray.push({
      path: error.path,
      message: error.message,
    });
  });

  return errorArray;
};
