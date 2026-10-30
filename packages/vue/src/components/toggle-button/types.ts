import type {ToggleButtonVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface ToggleButtonRootProps {
  /**
   * The visual variant of the toggle button.
   * @default "default"
   */
  variant?: ToggleButtonVariants["variant"];
  /**
   * The size of the toggle button. Defaults to the size of the enclosing
   * toggle button group.
   */
  size?: ToggleButtonVariants["size"];
  isIconOnly?: boolean;
  isDisabled?: boolean;
  /**
   * The value that identifies the toggle button inside a toggle button group.
   */
  value?: string;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
}

export interface ToggleButtonGroupContext {
  isSingle: Ref<boolean>;
  isDisabled: Ref<boolean>;
  size: Ref<ToggleButtonVariants["size"] | undefined>;
  /**
   * The values selected inside the group.
   */
  selected: Ref<unknown[]>;
  isSelected: (value: unknown) => boolean;
  toggle: (value: unknown) => void;
}

export const toggleButtonGroupContextKey: InjectionKey<ToggleButtonGroupContext> = Symbol(
  "sail-toggle-button-group",
);
