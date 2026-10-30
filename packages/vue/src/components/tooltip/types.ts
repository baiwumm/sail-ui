import type {TooltipSide, TooltipTriggerMode} from "./context";

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
  closeDelay?: number;
  isDisabled?: boolean;
  trigger?: TooltipTriggerMode;
}

export interface TooltipContentProps {
  placement?: TooltipSide;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
  avoidCollisions?: boolean;
  showArrow?: boolean;
}

export interface TooltipTriggerProps {
  isDisabled?: boolean;
}
