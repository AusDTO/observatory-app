interface ISomeObject {
  [key: string]: string;
}

const AgencyNameMap: ISomeObject = {
  "dta.gov.au": "DTA",
  "digital.gov.au": "DTA",
  "ato.gov.au": "ATO",
};

export const getAgencyCodeFromEmail = (email: string) => {
  const emailHost = email.split("@")[1];
  const agencyCode = AgencyNameMap[emailHost];
  if (agencyCode) {
    return agencyCode;
  } else return false;
};

export const getEmailHost = (email: string) => {
  return email.split(/(?=@)/g)[1];
};
