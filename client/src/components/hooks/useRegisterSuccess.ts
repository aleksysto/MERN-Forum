import { useState } from "react";
import { useRegisterSuccessHook } from "../interfaces/useRegisterSuccessTypes";

export default function useRegisterSuccess(): useRegisterSuccessHook {
  const [registerSuccess, newRegisterSucess] = useState<boolean>(false);
  function setRegisterSuccess(value: boolean): void {
    newRegisterSucess(value);
  }
  return { registerSuccess, setRegisterSuccess };
}
