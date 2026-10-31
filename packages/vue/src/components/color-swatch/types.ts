import type {ColorSwatchVariants} from "@sail-ui/styles";

import type {ColorValue} from "../../shared/color-context";

export interface ColorSwatchProps {
  /** The color to display. Falls back to the enclosing `ColorPicker` color. */
  color?: ColorValue;
  /** An accessible label for the color. Derived from the color when omitted. */
  label?: string;
  /** @default "circle" */
  shape?: ColorSwatchVariants["shape"];
  /** @default "md" */
  size?: ColorSwatchVariants["size"];
}
