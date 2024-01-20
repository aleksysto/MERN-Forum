import { useState } from "react";
import { useConfirmHook } from "../interfaces/useConfirmTypes";

export default function useRegisterSuccess(): useConfirmHook {
  const [action, setAction] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  return { action, confirm, setAction, setConfirm };
}
