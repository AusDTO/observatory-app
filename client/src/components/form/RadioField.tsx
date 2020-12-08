import { useField } from "formik";
import React from "react";
import { AuRadio } from "../../types/auds";

interface RadioFieldProps {
  // legend: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (e: any) => void;
  className?: string;
  label: string;
  value: string;
  defaultChecked?: boolean;

  block?: boolean;
}

const RadioField: React.FC<RadioFieldProps> = (props: RadioFieldProps) => {
  const [field] = useField({ ...props });
  // const error = meta.error && meta.touched ? true : false;

  return <AuRadio {...field} {...props} id={`${props.value}-radio`} />;
};

export default RadioField;
