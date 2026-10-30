import type {ModalPlacement} from "./context";
import type {ModalVariants} from "@sail-ui/styles";

export interface ModalRootProps {
  open?: boolean;
  defaultOpen?: boolean;
}

export interface ModalTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface ModalBackdropProps {
  variant?: ModalVariants["variant"];
  isDismissable?: boolean;
}

export interface ModalContainerProps {
  placement?: ModalPlacement;
  scroll?: ModalVariants["scroll"];
  size?: ModalVariants["size"];
}

export interface ModalCloseTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}
