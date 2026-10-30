import type {ButtonVariants} from "@sail-ui/styles";
import type {AsTag} from "reka-ui";
import type {Component} from "vue";

export interface ButtonProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  fullWidth?: boolean;
  isIconOnly?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  /**
   * The native button type. Only applies when the button renders as a `<button>`.
   * @default "button"
   */
  type?: "button" | "submit" | "reset";
  /**
   * The element or component to render as.
   * @default "button"
   */
  as?: AsTag | Component;
  /**
   * Merge the props into the single child element instead of rendering a new one.
   */
  asChild?: boolean;
}
