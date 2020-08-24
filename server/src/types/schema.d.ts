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

export interface IResetPasswordType {
  newPassword: string;
  key: string;
}

export interface IKeyValidType {
  key: string;
}
