import type {ComboBoxKey, ComboBoxModelValue} from "../../shared/combobox-context";
export type ComboBoxMenuTrigger = "focus" | "input" | "manual";

export interface ComboBoxRootProps {
  modelValue?: ComboBoxKey;
  defaultValue?: ComboBoxKey;
  /** Text shown in the input when the root controls it. */
  inputValue?: string;
  defaultInputValue?: string;
  /**
   * What opens the popover.
   * @default "focus"
   */
  menuTrigger?: ComboBoxMenuTrigger;
  /** Accept the typed text as the value when Enter matches no option. */
  allowsCustomValue?: boolean;
  /** Skip Reka's built-in `contains` filtering (async/server results). */
  ignoreFilter?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  fullWidth?: boolean;
  name?: string;
  open?: boolean;
  defaultOpen?: boolean;
  /**
   * Selected label resolver used before an option has mounted, e.g. SSR or a
   * server-provided `defaultValue`.
   */
  displayValue?: (value: ComboBoxKey) => string | undefined;
}

export type ComboBoxRootEmits = {
  "update:modelValue": [value: ComboBoxModelValue];
  "update:inputValue": [value: string];
  "update:open": [open: boolean];
  "selection-change": [value: ComboBoxModelValue];
};

export interface ComboBoxInputGroupProps {}

export interface ComboBoxTriggerProps {
  isDisabled?: boolean;
}

export interface ComboBoxValueProps {}

export interface ComboBoxPopoverProps {
  placement?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
  avoidCollisions?: boolean;
}
