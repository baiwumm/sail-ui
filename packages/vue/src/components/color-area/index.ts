import ColorAreaRoot from "./color-area-root.vue";
import ColorAreaThumb from "./color-area-thumb.vue";

const ColorArea = Object.assign(ColorAreaRoot, {
  Root: ColorAreaRoot,
  Thumb: ColorAreaThumb,
});

export {ColorArea, ColorAreaRoot, ColorAreaThumb};

export type {
  ColorAreaRootProps,
  ColorAreaRootProps as ColorAreaProps,
  ColorAreaRootEmits,
  ColorAreaRootEmits as ColorAreaEmits,
  ColorAreaThumbProps,
} from "./types";

export {colorAreaVariants, type ColorAreaVariants} from "@sail-ui/styles";
