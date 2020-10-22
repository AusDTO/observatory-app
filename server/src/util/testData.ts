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

export const top10Data = {
  topTen: [
    {
      pageUrl: "designsystem.gov.au/contact",
      pageTitle: "Contact us",
      pageViews: "10000",
      rank: "1",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/feedback",
      pageTitle: "leave feedback",
      pageViews: "9000",
      rank: "2",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/information",
      pageTitle: "Information",
      pageViews: "9000",
      rank: "3",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/privacy",
      pageTitle: "privacy",
      pageViews: "8000",
      rank: "4",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/accessibility",
      pageTitle: "Accessibility",
      pageViews: "7000",
      rank: "5",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/community",
      pageTitle: "community",
      pageViews: "6000",
      rank: "6",
      percentage: "10",
    },
  ],
  topTenGrowth: [
    {
      pageUrl: "designsystem.gov.au/contact",
      pageTitle: "Contact us",
      pageViews: "10000",
      rank: "1",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/feedback",
      pageTitle: "leave feedback",
      pageViews: "9000",
      rank: "2",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/information",
      pageTitle: "Information",
      pageViews: "9000",
      rank: "3",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/privacy",
      pageTitle: "privacy",
      pageViews: "8000",
      rank: "4",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/accessibility",
      pageTitle: "Accessibility",
      pageViews: "7000",
      rank: "5",
      percentage: "10",
    },
    {
      pageUrl: "designsystem.gov.au/community",
      pageTitle: "community",
      pageViews: "6000",
      rank: "6",
      percentage: "10",
    },
  ],
};

export const execDailyData = {
  type: "exec_daily",
  output: [
    {
      timeOnPage: "HELoooooo",
      date: "01/-",
      pageViews: "5000",
      sessions: "2099",
      bounceRate: "55%",
      aveSessionsPerUser: "20",
      pagesPerSession: "1.4",
      aveSessionDuration: "10",
      users: "200",
      newUsers: "20",
      returningUsers: "20",
      topTen: top10Data.topTen,
      topTenGrowth: top10Data.topTenGrowth,
    },
    {
      timeOnPage: "bla2",
      date: "01/01/20",
      pageViews: "9938",
      sessions: "879345",
      bounceRate: "55%",
      aveSessionsPerUser: "20",
      pagesPerSession: "1.4",
      aveSessionDuration: "10",
      users: "200",
      newUsers: "20",
      returningUsers: "20",
      topTen: top10Data.topTen,
      topTenGrowth: top10Data.topTenGrowth,
    },
  ],
};

export const execDailyInvalidType = [
  {
    type: "bla",
    output: [
      {
        timeOnPage: "HELoooooo",
        date: "01/-",
        pageViews: "5000",
        sessions: "2099",
        bounceRate: "55%",
        aveSessionsPerUser: "20",
        pagesPerSession: "1.4",
        aveSessionDuration: "10",
        users: "200",
        newUsers: "20",
        returningUsers: "20",
        topTen: top10Data.topTen,
        topTenGrowth: top10Data.topTenGrowth,
      },
      {
        timeOnPage: "bla2",
        date: "01/01/20",
        pageViews: "9938",
        sessions: "879345",
        bounceRate: "55%",
        aveSessionsPerUser: "20",
        pagesPerSession: "1.4",
        aveSessionDuration: "10",
        users: "200",
        newUsers: "20",
        returningUsers: "20",
        topTen: top10Data.topTen,
        topTenGrowth: top10Data.topTenGrowth,
      },
    ],
  },
];

export const execDailyInvalidOutput = [
  {
    type: "exec_daily",
    output: [
      {
        date: "01/-",
        pageViews: "5000",
        sessions: "2099",
        bounceRate: "55%",
        aveSessionsPerUser: "20",
        pagesPerSession: "1.4",
        aveSessionDuration: "10",
        users: "200",
        newUsers: "20",
        returningUsers: "20",
      },
      {
        timeOnPage: "bla2",
        date: "01/01/20",
        pageViews: "9938",
        sessions: "879345",
        bounceRate: "55%",
        aveSessionsPerUser: "20",
        pagesPerSession: "1.4",
        aveSessionDuration: "10",
        users: "200",
        newUsers: "20",
        returningUsers: "20",
      },
    ],
  },
];
