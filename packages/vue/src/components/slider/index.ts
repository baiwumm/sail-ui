import SliderFill from "./slider-fill.vue";
import SliderMark from "./slider-mark.vue";
import SliderMarks from "./slider-marks.vue";
import SliderOutput from "./slider-output.vue";
import SliderRoot from "./slider-root.vue";
import SliderStep from "./slider-step.vue";
import SliderSteps from "./slider-steps.vue";
import SliderThumb from "./slider-thumb.vue";
import SliderTrack from "./slider-track.vue";

const Slider = Object.assign(SliderRoot, {
  Root: SliderRoot,
  Output: SliderOutput,
  Track: SliderTrack,
  Fill: SliderFill,
  Thumb: SliderThumb,
  Step: SliderStep,
  Steps: SliderSteps,
  Mark: SliderMark,
  Marks: SliderMarks
});

export {
  Slider,
  SliderRoot,
  SliderOutput,
  SliderTrack,
  SliderFill,
  SliderThumb,
  SliderStep,
  SliderSteps,
  SliderMark,
  SliderMarks
};
export type {
  SliderRootProps,
  SliderRootProps as SliderProps,
  SliderOutputProps,
  SliderTrackProps,
  SliderFillProps,
  SliderThumbProps,
  SliderStepProps,
  SliderStepsProps,
  SliderMarkProps,
  SliderMarksProps
} from "./types";
export {sliderVariants, type SliderVariants} from "@sail-ui/styles";
