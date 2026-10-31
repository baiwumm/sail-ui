import ColorSliderOutput from "./color-slider-output.vue";
import ColorSliderRoot from "./color-slider-root.vue";
import ColorSliderThumb from "./color-slider-thumb.vue";
import ColorSliderTrack from "./color-slider-track.vue";

const ColorSlider = Object.assign(ColorSliderRoot, {
  Root: ColorSliderRoot,
  Output: ColorSliderOutput,
  Track: ColorSliderTrack,
  Thumb: ColorSliderThumb,
});

export {ColorSlider, ColorSliderRoot, ColorSliderOutput, ColorSliderTrack, ColorSliderThumb};

export type {
  ColorSliderRootProps,
  ColorSliderRootProps as ColorSliderProps,
  ColorSliderRootEmits,
  ColorSliderRootEmits as ColorSliderEmits,
  ColorSliderChannel,
} from "./types";

export {colorSliderVariants, type ColorSliderVariants} from "@sail-ui/styles";
