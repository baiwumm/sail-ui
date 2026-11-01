import type {Color} from "reka-ui";

import type {ColorValue} from "../../shared/color-context";
import type {PopoverSide} from "../popover/context";

export interface ColorPickerRootProps {
  /** The selected color when the picker is controlled. */
  modelValue?: ColorValue;
  /** The color selected when the picker is uncontrolled. */
  defaultValue?: ColorValue;
  /** Whether the popover is open when the picker is controlled. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  /**
   * The name submitted with the owning form. Composed parts fall back to it,
   * so a ColorField inside the picker submits under the picker's name.
   */
  name?: string;
}

export interface ColorPickerRootEmits {
  "update:color": [value: Color];
  change: [value: string];
}

export interface ColorPickerTriggerProps {
  isDisabled?: boolean;
}

export interface ColorPickerPopoverProps {
  /** @default "bottom" */
  placement?: PopoverSide;
  /** @default "start" */
  align?: "start" | "center" | "end";
  /** @default 0 */
  alignOffset?: number;
  /** @default 8 */
  sideOffset?: number;
  /** @default true */
  avoidCollisions?: boolean;
}
