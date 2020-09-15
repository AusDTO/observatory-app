import React from "react";
import { AuPageAlert } from "../../types/auds";

interface Props {}
const ServiceBanner: React.FC<Props> = ({ children }) => {
  return (
    <div className="blue-green-gradient au-body ">
      <div className="container-fluid ptb-15">{children}</div>
    </div>
  );
};

export default ServiceBanner;
