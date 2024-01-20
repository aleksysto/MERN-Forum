export interface useConfirmHook {
  action: boolean;
  confirm: boolean;
  setAction: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}
