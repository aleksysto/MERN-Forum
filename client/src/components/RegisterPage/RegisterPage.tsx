import React from "react";
import useRegisterSuccess from "../hooks/useRegisterSuccess";
import RegisterForm from "./RegisterForm";
import { RegisterHookValues } from "../interfaces/useRegisterSuccessTypes";
import { Link } from "react-router-dom";

export default function RegisterPage(): JSX.Element {
  const { registerSuccess, setRegisterSuccess }: RegisterHookValues =
    useRegisterSuccess();

  return registerSuccess ? (
    <>
      <div className="FinishedRegister">
        <div>Your account has been created</div>
        <Link to={{ pathname: "/login" }}>You can log into your account here</Link>
      </div>
    </>
  ) : (
    <>
      <div className="RegisterForm">
        <RegisterForm setRegisterSuccess={setRegisterSuccess} />
      </div>
    </>
  );
}
