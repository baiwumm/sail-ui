import type {AlertDialogPlacement, AlertDialogStatus} from "./context";
import type {AlertDialogVariants} from "@sail-ui/styles";

export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
}

export interface AlertDialogTriggerProps {
  isDisabled?: boolean;
}

export interface AlertDialogBackdropProps {
  variant?: AlertDialogVariants["variant"];
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}

export interface AlertDialogContainerProps {
  placement?: AlertDialogPlacement;
  size?: AlertDialogVariants["size"];
}

export interface AlertDialogIconProps {
  status?: AlertDialogStatus;
}

export interface AlertDialogCloseTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}
