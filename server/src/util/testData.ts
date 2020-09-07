import { IAgency } from "../types/other";

export const testUser = {
  email: "sukhraj.ghuman@dta.gov.au",
  password: "Password123!@#",
  name: "Raj",
  role: "Data analyst",
};

export const testAgency = {
  name: "DTA",
};

export const testAgency2 = {
  name: "ATO",
};

export const testProperies = [
  {
    domain: "www.dta.gov.au",
    service_name: "Dta website",
    ua_id: "UA-123456", //FIX check UAID length
  },
  {
    domain: "www.designsystem.gov.au",
    service_name: "Design System",
    ua_id: "UA-654321", //FIX check UAID length
  },
];

export const agencyListOneItem: Array<IAgency> = [
  {
    name: "DTA",
  },
];

export const agencyListTwoItems: Array<IAgency> = [
  {
    name: "DCOMMs",
  },
  {
    name: "ATO",
  },
];

export const agencyListDuplicateItems: Array<IAgency> = [
  {
    name: "DHS",
  },
  {
    name: "Home affairs",
  },
  {
    name: "DHS",
  },
];
