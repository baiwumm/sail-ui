import type {RadioGroupVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface RadioGroupRootProps {
  /**
   * The visual variant shared by the radios of the group.
   * @default "primary"
   */
  variant?: RadioGroupVariants["variant"];
  /**
   * The orientation of the group.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The name shared by the radio inputs of the group. It is generated when
   * omitted so the browser still groups the inputs for arrow key navigation.
   */
  name?: string;
  /**
   * The reading direction of the group. Inherited from the document when
   * omitted.
   */
  dir?: "ltr" | "rtl";
}

export interface RadioGroupContext {
  name: Ref<string>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isRequired: Ref<boolean>;
  selectedValue: Ref<string | undefined>;
  select: (value: string) => void;
  hasSelection: Ref<boolean>;
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> =
  Symbol("sail-radio-group");
