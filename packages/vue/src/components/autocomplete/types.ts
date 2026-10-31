import type {AutocompleteVariants} from "@sail-ui/styles";

import type {ComboBoxKey, ComboBoxModelValue} from "../../shared/combobox-context";

export interface AutocompleteRootProps {
  modelValue?: ComboBoxKey;
  defaultValue?: ComboBoxKey;
  placeholder?: string;
  /**
   * The visual variant of the trigger.
   * @default "primary"
   */
  variant?: AutocompleteVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  open?: boolean;
  defaultOpen?: boolean;
  /** Skip Reka's built-in `contains` filtering (async/server results). */
  ignoreFilter?: boolean;
  /** Selected label resolver used before an option has mounted, e.g. SSR. */
  displayValue?: (value: ComboBoxKey) => string | undefined;
  /** Called after the clear button removes the selection. */
  onClear?: () => void;
}

export type AutocompleteRootEmits = {
  "update:modelValue": [value: ComboBoxModelValue];
  "update:open": [open: boolean];
  "selection-change": [value: ComboBoxModelValue];
};

export interface AutocompleteTriggerProps {
  isDisabled?: boolean;
}

export interface AutocompleteValueProps {}

export interface AutocompleteIndicatorProps {}

export interface AutocompleteClearButtonProps {
  isDisabled?: boolean;
}

export interface AutocompletePopoverProps {
  placement?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  alignOffset?: number;
  sideOffset?: number;
  avoidCollisions?: boolean;
}

export interface AutocompleteFilterProps {}
