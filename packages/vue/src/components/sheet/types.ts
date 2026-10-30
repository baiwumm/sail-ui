import type {SheetPlacement} from "./context";
import type {SheetVariants} from "@sail-ui/styles";

export interface SheetRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  placement?: SheetPlacement;
}

export interface SheetTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface SheetBackdropProps {
  variant?: SheetVariants["backdrop"];
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
}

export interface SheetCloseProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface SheetCloseTriggerProps {
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}
