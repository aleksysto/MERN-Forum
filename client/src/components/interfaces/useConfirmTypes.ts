export interface useConfirmHook {
  deleting: boolean;
  confirm: boolean;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}
