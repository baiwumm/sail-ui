import type {TextAreaVariants} from "@sail-ui/styles";

export interface TextAreaRootProps {
  /**
   * The visual variant of the textarea.
   * @default "primary"
   */
  variant?: TextAreaVariants["variant"];
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  /**
   * The name submitted with the owning form.
   */
  name?: string;
  /**
   * The number of visible rows.
   */
  rows?: number;
  /**
   * Grow the height with the content instead of scrolling.
   * @default false
   */
  autoResize?: boolean;
}
