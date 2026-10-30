import type {CloseButtonVariants} from "@sail-ui/styles";

export interface CloseButtonRootProps {
  variant?: CloseButtonVariants["variant"];
  isDisabled?: boolean;
  isPending?: boolean;
  type?: "button" | "submit" | "reset";
}
