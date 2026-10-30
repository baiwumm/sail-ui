import type {CheckboxVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface CheckboxRootProps {
  /**
   * The visual variant of the checkbox.
   * @default "primary"
   */
  variant?: CheckboxVariants["variant"];
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
  /**
   * The value submitted with the owning form and the identity inside a
   * `CheckboxGroup`.
   * @default "on"
   */
  value?: string;
}

export interface CheckboxContentProps {
  class?: string;
}

export interface CheckboxControlProps {
  class?: string;
}

export interface CheckboxIndicatorProps {
  class?: string;
}

export interface CheckboxContext {
  isSelected: Ref<boolean>;
  isIndeterminate: Ref<boolean>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isRequired: Ref<boolean>;
  name: Ref<string | undefined>;
  value: Ref<string>;
  toggle: () => void;
}

export const checkboxContextKey: InjectionKey<CheckboxContext> = Symbol("sail-checkbox");
