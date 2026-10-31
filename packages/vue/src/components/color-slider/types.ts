import type {Color, ColorChannel, ColorSpace} from "reka-ui";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import type {ColorValue} from "../../shared/color-context";

export type ColorSliderChannel = ColorChannel;

export interface ColorSliderRootProps {
  /** The color value when the slider is controlled. */
  modelValue?: ColorValue;
  /** The color value when the slider is uncontrolled. */
  defaultValue?: ColorValue;
  /** The color channel this slider adjusts. */
  channel: ColorChannel;
  /** @default "hsl" */
  colorSpace?: ColorSpace;
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Inherited from the document when omitted. */
  dir?: "ltr" | "rtl";
  /** @default false */
  inverted?: boolean;
  isDisabled?: boolean;
  /** Overrides the channel's natural step. */
  step?: number;
  /** The name submitted with the owning form. */
  name?: string;
  isRequired?: boolean;
}

export interface ColorSliderRootEmits {
  "update:color": [value: Color];
  change: [value: string];
  "change-end": [value: string];
}

export interface ColorSliderContext {
  isDragging: Ref<boolean>;
  dir: ComputedRef<"ltr" | "rtl">;
}

export const colorSliderContextKey: InjectionKey<ColorSliderContext> = Symbol("sail-color-slider");
