type SelectOptionType = {
  value?: string;
  text: string;
};

interface RegisterData {
  name: string;
  email: string;
  agency: string;
  role: string;
  password: string;
}

interface ResendEmailData {
  email: string;
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

type RegisterErrorName = "name" | "email" | "agency" | "role" | "password";

type LoginErrorName = "password" | "email";
