import { useState } from "react";
import { useConfirmHook } from "../interfaces/useConfirmTypes";

export default function useRegisterSuccess(): useConfirmHook {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  return { deleting, confirm, setDeleting, setConfirm };
}
