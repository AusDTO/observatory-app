import React from "react";
import { AuPageAlert } from "../../types/auds";

interface Props {
  type: "error" | "warning" | "success" | "info";
  children: React.ReactElement;
  className?: string;
}
const PageAlert: React.FC<Props> = ({ type, children, className }) => {
  return (
    <AuPageAlert as={type} className={className}>
      {children}
    </AuPageAlert>
  );
};

export default PageAlert;
