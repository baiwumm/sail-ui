import type {ColorInputGroupVariants} from "@sail-ui/styles";
import type {Color, ColorChannel, ColorSpace} from "reka-ui";
import type {ComputedRef} from "vue";

import type {ColorValue} from "../../shared/color-context";

export interface ColorFieldRootProps {
  /** The color value when the field is controlled. */
  modelValue?: ColorValue;
  /** The color value when the field is uncontrolled. */
  defaultValue?: ColorValue;
  /** @default "hsl" */
  colorSpace?: ColorSpace;
  /** Displays a single channel instead of the hex value. */
  channel?: ColorChannel;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  /** @default false */
  fullWidth?: boolean;
  disableWheelChange?: boolean;
  /** The name submitted with the owning form. */
  name?: string;
  /** Overrides the channel's natural step. */
  step?: number;
  locale?: string;
}

export interface ColorFieldRootEmits {
  "update:color": [value: Color];
  change: [value: string];
}

export interface ColorInputGroupProps {
  /** @default "primary" */
  variant?: ColorInputGroupVariants["variant"];
  /** @default false */
  fullWidth?: boolean;
}

export interface ColorFieldContext {
  labelId: string;
  describedBy: ComputedRef<string | undefined>;
  isDisabled: ComputedRef<boolean>;
  isInvalid: ComputedRef<boolean>;
  isReadOnly: ComputedRef<boolean>;
  isRequired: ComputedRef<boolean>;
}
