import type {MenuRootEmits, MenuRootProps} from "../menu/types";

export type DropdownSide = "top" | "right" | "bottom" | "left";

export interface DropdownRootProps {
  /** The controlled open state of the menu. */
  open?: boolean;
  /** The open state when the menu is uncontrolled. */
  defaultOpen?: boolean;
  /** The reading direction of the menu. */
  dir?: "ltr" | "rtl";
  /**
   * Whether the menu is modal.
   * @default false
   */
  modal?: boolean;
}

export interface DropdownTriggerProps {
  /** Whether the trigger is disabled. */
  isDisabled?: boolean;
  /**
   * The native button type.
   * @default "button"
   */
  type?: "button" | "submit" | "reset";
}

export type DropdownMenuProps = MenuRootProps;
export type DropdownMenuEmits = MenuRootEmits;

export interface DropdownPopoverProps {
  /**
   * The preferred side of the trigger to render against.
   * @default "bottom"
   */
  placement?: DropdownSide;
  /**
   * The preferred alignment against the trigger.
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /**
   * An offset in pixels from the start or end alignment.
   * @default 0
   */
  alignOffset?: number;
  /**
   * The distance in pixels from the trigger.
   * @default 0
   */
  sideOffset?: number;
  /**
   * Flip to the opposite side when colliding with the boundary.
   * @default true
   */
  avoidCollisions?: boolean;
}

export interface DropdownSubmenuTriggerProps {}
