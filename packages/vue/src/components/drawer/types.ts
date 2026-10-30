import type {DrawerPlacement} from "./context";
import type {DrawerVariants} from "@sail-ui/styles";

export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
}

export interface DrawerTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface DrawerBackdropProps {
  variant?: DrawerVariants["variant"];
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}

export interface DrawerContentProps {
  placement?: DrawerPlacement;
}

export interface DrawerCloseTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}
