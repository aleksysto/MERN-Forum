import * as Yup from "yup";
export type UserRegisterValidation = Yup.ObjectSchema<{
  image: any;
  login: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  tos: boolean | undefined;
}>;
export interface RegisterFormValues {
  image: any;
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
  tos: boolean;
  profilePicture: "";
}

export interface RegisterUserObject {
  login: string;
  email: string;
  password: string;
  profilePicture: string;
}
