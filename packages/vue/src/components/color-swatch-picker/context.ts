import type {ComputedRef, InjectionKey} from "vue";
import type {ColorValue} from "../../shared/color-context";

import {inject} from "vue";

import type {ColorSwatchPickerContext} from "./types";

export const colorSwatchPickerContextKey: InjectionKey<ColorSwatchPickerContext> = Symbol(
  "sail-color-swatch-picker",
);

export interface ColorSwatchPickerItemContext {
  color: ComputedRef<ColorValue>;
}

export const colorSwatchPickerItemContextKey: InjectionKey<ColorSwatchPickerItemContext> = Symbol(
  "sail-color-swatch-picker-item",
);

export function useColorSwatchPickerItemContext(): ColorSwatchPickerItemContext {
  const context = inject(colorSwatchPickerItemContextKey, null);

  if (!context) {
    throw new Error("ColorSwatchPicker parts must be used inside <ColorSwatchPickerItem>.");
  }

  return context;
}
