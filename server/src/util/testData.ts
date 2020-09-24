import { IAgency } from "../types/other";

export const testUser = {
  email: "sukhraj.ghuman@dta.gov.au",
  password: "Password123!@#",
  name: "Raj",
  role: "Data analyst",
  emailHost: "@dta.gov.au",
};

export const testAgency = {
  name: "DTA",
  emailHosts: ["@dta.gov.au", "@digital.gov.au"],
};

export const testAgency2 = {
  name: "ATO",
  emailHosts: ["@ato.gov.au", "@bla.gov.au"],
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
    emailHosts: ["@dta.gov.au", "@digital.gov.au"],
  },
];

export const agencyListTwoItems: Array<IAgency> = [
  {
    name: "DCOMMs",
    emailHosts: ["@comms.gov.au", "@ca.gov.au", "@ba.gov.au"],
  },
  {
    name: "ATO",
    emailHosts: ["@ato.gov.au"],
  },
];

export const agencyListDuplicateItems: Array<IAgency> = [
  {
    name: "DHS",
    emailHosts: ["@dhs.gov.au"],
  },
  {
    name: "Home affairs",
    emailHosts: ["@homeaffairs.gov.au"],
  },
  {
    name: "DHS",
    emailHosts: ["@dhs.gov.au"],
  },
];

export const weeklyBasicsValidData = {
  type: "weekly_basics",
  output: [
    {
      ave_time_on_page: "HELoooooo",
      date: "01/-",
      pageViews: "5000",
      sessions: "2099",
    },
    {
      ave_time_on_page: "bla2",
      date: "01/01/20",
      pageViews: "9938",
      sessions: "879345",
    },
  ],
};
