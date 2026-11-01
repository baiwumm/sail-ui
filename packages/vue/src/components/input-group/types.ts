import type {InputGroupVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface InputGroupRootProps {
  /**
   * The visual variant of the group.
   * @default "primary"
   */
  variant?: InputGroupVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

export interface InputGroupInputProps {
  class?: string;
}

export interface InputGroupTextAreaProps {
  class?: string;
}

export interface InputGroupPrefixProps {
  class?: string;
}

export interface InputGroupSuffixProps {
  class?: string;
}

export interface InputGroupContext {
  isDisabled: Ref<boolean>;
}

export const inputGroupContextKey: InjectionKey<InputGroupContext> = Symbol("sail-input-group");
