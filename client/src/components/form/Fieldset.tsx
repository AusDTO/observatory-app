import React from "react";
import { AuFieldset, AuLegend } from "../../types/auds";

interface FieldsetProps {
  // legend: string;
  legend: string;
  children: React.ReactElement;
}

const FieldsetGroup: React.FC<FieldsetProps> = ({ children, legend }) => {
  return (
    <AuFieldset>
      <AuLegend>{legend}</AuLegend>
      {children}
    </AuFieldset>
  );
};

export default FieldsetGroup;
