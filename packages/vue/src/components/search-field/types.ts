import type {SearchFieldVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface SearchFieldRootProps {
  /**
   * The visual variant of the search field.
   * @default "primary"
   */
  variant?: SearchFieldVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
  /**
   * The accessible label of the search input.
   */
  label?: string;
}

export interface SearchFieldGroupProps {
  class?: string;
}

export interface SearchFieldInputProps {
  class?: string;
}

export interface SearchFieldSearchIconProps {
  class?: string;
}

export interface SearchFieldClearButtonProps {
  class?: string;
}

export interface SearchFieldContext {
  value: Ref<string>;
  isEmpty: Ref<boolean>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  label: Ref<string | undefined>;
  setValue: (value: string) => void;
  clear: () => void;
  submit: (value: string) => void;
}

export const searchFieldContextKey: InjectionKey<SearchFieldContext> = Symbol("sail-search-field");
