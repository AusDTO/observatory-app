// tslint:disable

export interface IUserType {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface IResendConfirmation {
  email: string;
}

export interface IForgotPasswordSendEmailType {
  email: string;
}

export interface ISendFeedbackType {
  feedback: string;
  pageTitle: string;
  pageUrl: string;
}

export interface IResetPasswordType {
  newPassword: string;
  key: string;
}

export interface IKeyValidType {
  key: string;
}

export interface IAgencyIdType {
  agency_id: string;
}

export interface IGetPropertyType {
  property_ua_id: string;
}

export interface IGetDataFromUrlType {
  property_ua_id: string;
  url: string;
  dateType: string;
}

export interface IGetOutputDataType {
  type: DataOutputType;
  property_ua_id: string;
}

export type DataOutputType = "exec_weekly" | "exec_daily" | "exec_hourly";
