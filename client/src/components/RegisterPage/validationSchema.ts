import * as Yup from "yup";
import { UserRegisterValidation } from "../interfaces/RegisterUserTypes";
import axios, { AxiosResponse } from "axios";
export async function testLoginAvailability(value: string): Promise<boolean> {
  const response: AxiosResponse<{ available: boolean }> = await axios.get(
    `/api/register/checkAvailability?value=${value}&type=login`
  );
  return response.data.available;
}
export async function testEmailAvailability(value: string): Promise<boolean> {
  const response: AxiosResponse<{ available: boolean }> = await axios.get(
    `/api/register/checkAvailability?value=${value}&type=email`
  );
  return response.data.available;
}
export function checkImageSize(value: any): boolean {
  if (value) {
    const file: File = value as File;
    if (file.size > 2097152) {
      // 2097152 = 2mb
      return false;
    }
    return true;
  } else {
    return true;
  }
}
export function checkImageFormat(value: any): boolean {
  console.log(value);
  if (value) {
    const file: File = value as File;
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      return false;
    }
    return true;
  } else {
    return true;
  }
}

const validationSchema: UserRegisterValidation = Yup.object({
  image: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", checkImageSize)
    .test("fileType", "Unsupported file format", checkImageFormat),
  login: Yup.string()
    .required("* Required")
    .min(3, "Must be 3 characters or more")
    .max(20, "Must be 20 characters or less")
    .test("Unique login", "Login is already taken", testLoginAvailability),
  email: Yup.string()
    .required("* Required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      "Invalid email address"
    )
    .test("Unique email", "Email is already taken", testEmailAvailability),
  password: Yup.string()
    .required("* Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("* Required"),
  tos: Yup.boolean().oneOf([true], "You need to accept our Terms & Conditions"),
});

export default validationSchema;
