import type {SelectItemVariant} from "./context";
import type {ListBoxVariants, SelectVariants} from "@sail-ui/styles";
import type {AcceptableValue} from "reka-ui";

export type SelectSelectionMode = "single" | "multiple";
export type SelectModelValue = AcceptableValue | AcceptableValue[];

export interface SelectRootProps {
  modelValue?: SelectModelValue;
  defaultValue?: SelectModelValue;
  selectionMode?: SelectSelectionMode;
  /** Keys that cannot be selected. */
  disabledKeys?: Iterable<AcceptableValue>;
  open?: boolean;
  defaultOpen?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  autoComplete?: string;
  fullWidth?: boolean;
  variant?: SelectVariants["variant"];
  by?: string | ((value: AcceptableValue, currentValue: AcceptableValue) => boolean);
  onClear?: () => void;
}

export interface SelectTriggerProps {
  isDisabled?: boolean;
}

export interface SelectValueProps {
  placeholder?: string;
}

export interface SelectPopoverProps {
  placement?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

export interface SelectListBoxProps {
  variant?: ListBoxVariants["variant"];
}

export interface SelectItemProps {
  value: AcceptableValue;
  textValue?: string;
  isDisabled?: boolean;
  variant?: SelectItemVariant;
}

export interface SelectItemIndicatorProps {
  variant?: SelectItemVariant;
}
