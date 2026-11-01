import type {CheckboxGroupVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface CheckboxGroupRootProps {
  /**
   * The visual variant shared by the checkboxes of the group.
   * @default "primary"
   */
  variant?: CheckboxGroupVariants["variant"];
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
}

export interface CheckboxGroupContext {
  isSelected: (value: string) => boolean;
  variant: Ref<CheckboxGroupVariants["variant"] | undefined>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isRequired: Ref<boolean>;
  name: Ref<string | undefined>;
  toggle: (value: string) => void;
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol("sail-checkbox-group");
