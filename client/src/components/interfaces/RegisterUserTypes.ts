import * as Yup from "yup";
import { UserObject } from "./UserObjectContext";
export type UserRegisterValidation = Yup.ObjectSchema<{
  image: any;
  login: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  tos: boolean | undefined;
}>;
export type EditUserValidation = Yup.ObjectSchema<{
  image: any;
  login: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
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
export interface EditFormValues {
  image: any;
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: "";
}
export interface RegisterUserObject {
  login: string;
  email: string;
  password: string;
  profilePicture: string;
}

export interface EditUserObject {
  login?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export interface EditFormProps {
  setForm: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface AdminEditFormProps extends EditFormProps {
  user: UserObject;
}
