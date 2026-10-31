import type {ColorSwatchPickerVariants, colorSwatchPickerVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

import type {ColorValue} from "../../shared/color-context";

export interface ColorSwatchPickerRootProps {
  /** The selected color when the picker is controlled. */
  modelValue?: ColorValue;
  /** The selected color when the picker is uncontrolled. */
  defaultValue?: ColorValue;
  isDisabled?: boolean;
  /** @default false */
  loop?: boolean;
  /** @default "ltr" */
  dir?: "ltr" | "rtl";
  /** @default "grid" */
  layout?: ColorSwatchPickerVariants["layout"];
  /** @default "md" */
  size?: ColorSwatchPickerVariants["size"];
  /** @default "circle" */
  variant?: ColorSwatchPickerVariants["variant"];
}

export interface ColorSwatchPickerRootEmits {
  change: [value: string];
}

export interface ColorSwatchPickerItemProps {
  /** The color this item represents. */
  color: ColorValue;
  isDisabled?: boolean;
  /** Overrides the accessible name derived from the color. */
  textValue?: string;
}

export interface ColorSwatchPickerContext {
  slots: ComputedRef<ReturnType<typeof colorSwatchPickerVariants>>;
  isDisabled: ComputedRef<boolean>;
}
