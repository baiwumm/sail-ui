import type {ButtonGroupVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface ButtonGroupRootProps {
  /**
   * The orientation of the button group.
   * @default "horizontal"
   */
  orientation?: ButtonGroupVariants["orientation"];
  /**
   * Stretch the group to the width of its container.
   */
  fullWidth?: boolean;
  /**
   * Size propagated to the buttons that are direct children of the group.
   */
  size?: "sm" | "md" | "lg";
  /**
   * Variant propagated to the buttons that are direct children of the group.
   */
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "danger" | "danger-soft";
  /**
   * Disables every button that is a direct child of the group.
   */
  isDisabled?: boolean;
}

export interface ButtonGroupSeparatorProps {
  class?: string;
}

export interface ButtonGroupContext {
  size: Ref<ButtonGroupRootProps["size"]>;
  variant: Ref<ButtonGroupRootProps["variant"]>;
  isDisabled: Ref<boolean>;
  fullWidth: Ref<boolean>;
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContext> = Symbol("sail-button-group");
