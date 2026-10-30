import type {InjectionKey, Ref} from "vue";

export interface RadioRootProps {
  /**
   * The value of the radio. It identifies the radio inside its group and is
   * submitted with the owning form.
   */
  value: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The name submitted with the owning form. Defaults to the name of the
   * enclosing radio group.
   */
  name?: string;
}

export interface RadioContentProps {
  class?: string;
}

export interface RadioControlProps {
  class?: string;
}

export interface RadioIndicatorProps {
  class?: string;
}

export interface RadioContext {
  isSelected: Ref<boolean>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isRequired: Ref<boolean>;
  name: Ref<string>;
  value: Ref<string>;
  tabIndex: Ref<number>;
  select: () => void;
}

export const radioContextKey: InjectionKey<RadioContext> = Symbol("sail-radio");
