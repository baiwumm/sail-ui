import type {InputVariants} from "@sail-ui/styles";
import type {FieldRootProps} from "reka-ui";
import type {InjectionKey, Ref} from "vue";

export interface TextFieldProps {
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  name?: string;
  fullWidth?: boolean;
  validate?: FieldRootProps["validate"];
  validationMode?: FieldRootProps["validationMode"];
  validationDebounceTime?: number;
  variant?: InputVariants["variant"];
}

export interface InputProps {
  modelValue?: string | number;
  defaultValue?: string | number;
  type?: string;
  variant?: InputVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  name?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export interface TextFieldContext {
  variant: Ref<InputVariants["variant"] | undefined>;
}

export const textFieldContextKey: InjectionKey<TextFieldContext> = Symbol("sail-textfield");
