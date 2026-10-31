import type {Color} from "reka-ui";
import type {InjectionKey, Ref} from "vue";

import {colorToString, parseColor} from "reka-ui";
import {computed, inject, ref} from "vue";

export type ColorValue = string | Color;

export interface ColorPickerContext {
  color: Readonly<Ref<Color>>;
  setColor: (value: ColorValue) => void;
}

export const colorPickerContextKey: InjectionKey<ColorPickerContext> = Symbol("sail-color-picker");

export interface ColorBindingOptions {
  /** Standalone uncontrolled value used when no model and no picker context exist. */
  defaultValue?: ColorValue;
  /** Initial value when neither a model, a picker nor `defaultValue` is present. */
  fallback?: ColorValue;
}

/**
 * Bridges a part's `v-model` with the enclosing `ColorPicker` state. Upstream
 * parts stay controlled by the picker unless they receive their own value.
 */
export function useColorBinding(
  model: Ref<ColorValue | undefined>,
  options: ColorBindingOptions = {},
) {
  const picker = inject(colorPickerContextKey, null);
  const internal = ref<ColorValue>(options.defaultValue ?? options.fallback ?? "#ff0000");

  const value = computed<ColorValue>(() => {
    if (model.value !== undefined) {
      return model.value;
    }

    if (picker) {
      return picker.color.value;
    }

    return internal.value;
  });

  function setValue(next: ColorValue) {
    if (model.value !== undefined) {
      model.value = next;
      return;
    }

    if (picker) {
      picker.setColor(next);
      return;
    }

    internal.value = next;
  }

  return {picker, setValue, value};
}

/** Parses a color string or object, falling back to black for invalid strings. */
export function toColor(value: ColorValue | undefined, fallback = "#000000"): Color {
  if (value === undefined) {
    return parseColor(fallback);
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return parseColor(value);
  } catch {
    return parseColor(fallback);
  }
}

export function toHex(value: ColorValue): string {
  return colorToString(toColor(value), "hex");
}

export function toCssColor(value: ColorValue): string {
  return colorToString(toColor(value), "rgb");
}
