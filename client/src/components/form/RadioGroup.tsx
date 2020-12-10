import React from "react";
import FieldsetGroup from "./Fieldset";

import RadioField from "./RadioField";

type Option = {
  name: string;
  label: string;
  value: string;
  className?: string;
  defaultChecked?: boolean;
  block?: boolean;
};

interface Props {
  options: Array<Option>;
  legend: string;
}

const RadioGroup = (props: Props) => {
  return (
    <FieldsetGroup legend={props.legend}>
      <>
        {props.options.map((option, i) => {
          return <RadioField {...option} key={i} />;
        })}
      </>
    </FieldsetGroup>
  );
};

export default RadioGroup;
