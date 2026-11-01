import type {NumberFieldVariants} from "@sail-ui/styles";
import type {InjectionKey} from "vue";

export interface NumberFieldRootProps {
  /**
   * The visual variant of the number field.
   * @default "primary"
   */
  variant?: NumberFieldVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The smallest value the field accepts.
   */
  min?: number;
  /**
   * The largest value the field accepts.
   */
  max?: number;
  /**
   * The amount the value changes on every increment or decrement.
   * @default 1
   */
  step?: number;
  /**
   * The formatting options applied to the displayed value.
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * The locale used to format and parse the value.
   */
  locale?: string;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
}

export interface NumberFieldGroupProps {
  class?: string;
}

export interface NumberFieldInputProps {
  class?: string;
}

export interface NumberFieldButtonProps {
  class?: string;
}

export interface NumberFieldContext {
  /**
   * The id of the label that names the input of the number field.
   */
  labelId: string;
  /**
   * The id of the spin button input, used by the label `for` association.
   */
  inputId: string;
}

export const numberFieldContextKey: InjectionKey<NumberFieldContext> = Symbol("sail-number-field");
