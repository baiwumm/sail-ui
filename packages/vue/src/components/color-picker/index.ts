import ColorPickerPopover from "./color-picker-popover.vue";
import ColorPickerRoot from "./color-picker-root.vue";
import ColorPickerTrigger from "./color-picker-trigger.vue";

const ColorPicker = Object.assign(ColorPickerRoot, {
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
  Popover: ColorPickerPopover,
});

export {ColorPicker, ColorPickerRoot, ColorPickerTrigger, ColorPickerPopover};

export type {
  ColorPickerRootProps,
  ColorPickerRootProps as ColorPickerProps,
  ColorPickerRootEmits,
  ColorPickerRootEmits as ColorPickerEmits,
  ColorPickerTriggerProps,
  ColorPickerPopoverProps,
} from "./types";

export {colorPickerVariants, type ColorPickerVariants} from "@sail-ui/styles";
