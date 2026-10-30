import type {PopoverSide} from "./context";

export interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
}

export interface PopoverTriggerProps {
  isDisabled?: boolean;
}

export interface PopoverContentProps {
  placement?: PopoverSide;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
  avoidCollisions?: boolean;
}

export interface PopoverDialogProps {
  as?: string;
}

export interface PopoverHeadingProps {
  as?: string;
}
