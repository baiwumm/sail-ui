import type {SwitchVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface SwitchRootProps {
  /**
   * The size of the switch.
   * @default "md"
   */
  size?: SwitchVariants["size"];
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
  /**
   * The value submitted with the owning form when the switch is on.
   * @default "on"
   */
  value?: string;
}

export interface SwitchContentProps {
  class?: string;
}

export interface SwitchControlProps {
  class?: string;
}

export interface SwitchThumbProps {
  class?: string;
}

export interface SwitchIconProps {
  class?: string;
}

export interface SwitchContext {
  isSelected: Ref<boolean>;
  isDisabled: Ref<boolean>;
  isInvalid: Ref<boolean>;
  isRequired: Ref<boolean>;
  name: Ref<string | undefined>;
  value: Ref<string>;
  toggle: () => void;
}

export const switchContextKey: InjectionKey<SwitchContext> = Symbol("sail-switch");
