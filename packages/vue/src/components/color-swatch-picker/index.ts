import ColorSwatchPickerIndicator from "./color-swatch-picker-indicator.vue";
import ColorSwatchPickerItem from "./color-swatch-picker-item.vue";
import ColorSwatchPickerRoot from "./color-swatch-picker-root.vue";
import ColorSwatchPickerSwatch from "./color-swatch-picker-swatch.vue";

const ColorSwatchPicker = Object.assign(ColorSwatchPickerRoot, {
  Root: ColorSwatchPickerRoot,
  Item: ColorSwatchPickerItem,
  Swatch: ColorSwatchPickerSwatch,
  Indicator: ColorSwatchPickerIndicator,
});

export {
  ColorSwatchPicker,
  ColorSwatchPickerRoot,
  ColorSwatchPickerItem,
  ColorSwatchPickerSwatch,
  ColorSwatchPickerIndicator,
};

export type {
  ColorSwatchPickerRootProps,
  ColorSwatchPickerRootProps as ColorSwatchPickerProps,
  ColorSwatchPickerRootEmits,
  ColorSwatchPickerRootEmits as ColorSwatchPickerEmits,
  ColorSwatchPickerItemProps,
} from "./types";

export {colorSwatchPickerVariants, type ColorSwatchPickerVariants} from "@sail-ui/styles";
