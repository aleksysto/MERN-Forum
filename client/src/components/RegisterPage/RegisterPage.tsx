import React, { useEffect } from "react";
import useRegisterSuccess from "../hooks/useRegisterSuccess";
import RegisterForm from "./RegisterForm";
import { RegisterHookValues } from "../interfaces/useRegisterSuccessTypes";

export default function RegisterPage(): JSX.Element {
  const { registerSuccess, setRegisterSuccess }: RegisterHookValues =
    useRegisterSuccess();

  return registerSuccess ? (
    <>
      <div>
        <div>Your account has been created</div>
        <a href="google.com">login</a>
      </div>
    </>
  ) : (
    <>
      <RegisterForm setRegisterSuccess={setRegisterSuccess} />
    </>
  );
}
