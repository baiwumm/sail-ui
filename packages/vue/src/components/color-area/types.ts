import type {Color, ColorChannel, ColorSpace} from "reka-ui";
import type {InjectionKey, Ref} from "vue";

import type {ColorValue} from "../../shared/color-context";

export interface ColorAreaRootProps {
  /** The selected color when the area is controlled. */
  modelValue?: ColorValue;
  /** The color used when the area is uncontrolled. */
  defaultValue?: ColorValue;
  /** @default "hsl" */
  colorSpace?: ColorSpace;
  /** @default "hue" */
  xChannel?: ColorChannel;
  /** @default "saturation" */
  yChannel?: ColorChannel;
  isDisabled?: boolean;
  /** The name of the x channel input submitted with the owning form. */
  xName?: string;
  /** The name of the y channel input submitted with the owning form. */
  yName?: string;
  name?: string;
  isRequired?: boolean;
  /** Renders the dot-pattern overlay. @default false */
  showDots?: boolean;
}

export interface ColorAreaRootEmits {
  "update:color": [value: Color];
  change: [value: string];
  "change-end": [value: string];
}

export interface ColorAreaThumbProps {
  class?: string;
}

export interface ColorAreaContext {
  isDragging: Ref<boolean>;
}

export const colorAreaContextKey: InjectionKey<ColorAreaContext> = Symbol("sail-color-area");
