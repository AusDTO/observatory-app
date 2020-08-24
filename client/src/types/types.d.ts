import { match, RouteComponentProps } from "react-router-dom";

type SelectOptionType = {
  value?: string;
  text: string;
};

interface RegisterData {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface ResendEmailData {
  email: string;
}

interface ResetPasswordEmailData {
  email: string;
}

interface ResetPasswordData {
  password: string;
}

interface loginData {
  email: string;
  password: string;
}

type ApiError = {
  message: string;
  path: string;
  // map: (any) => any;
};

type FormSubmitState = {
  isErrors: boolean;
  submitted?: boolean;
  apiError: boolean;
  apiErrorList: Array<ApiError>;
};

type RegisterErrorName = "name" | "email" | "role" | "password";

type LoginErrorName = "password" | "email";
