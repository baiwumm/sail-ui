import type {ToggleButtonGroupVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface ToggleButtonGroupRootProps {
  /**
   * Whether a single or multiple toggle buttons can be selected at a time.
   * @default "single"
   */
  type?: "single" | "multiple";
  /**
   * The orientation of the group.
   * @default "horizontal"
   */
  orientation?: ToggleButtonGroupVariants["orientation"];
  /**
   * The size propagated to the toggle buttons of the group.
   */
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  fullWidth?: boolean;
  /**
   * Whether the buttons are visually separated instead of connected.
   */
  isDetached?: boolean;
  /**
   * The reading direction of the group. Inherited from the document when
   * omitted.
   */
  dir?: "ltr" | "rtl";
}

export interface ToggleButtonGroupSeparatorProps {
  class?: string;
}

export interface ToggleButtonGroupContext {
  isSingle: Ref<boolean>;
  isDisabled: Ref<boolean>;
  size: Ref<"sm" | "md" | "lg" | undefined>;
  selected: Ref<unknown[]>;
  isSelected: (value: unknown) => boolean;
  toggle: (value: unknown) => void;
}

export const toggleButtonGroupContextKey: InjectionKey<ToggleButtonGroupContext> = Symbol(
  "sail-toggle-button-group",
);
