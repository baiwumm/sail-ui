import ProgressBarFill from "./progress-bar-fill.vue";
import ProgressBarOutput from "./progress-bar-output.vue";
import ProgressBarRoot from "./progress-bar-root.vue";
import ProgressBarTrack from "./progress-bar-track.vue";

const ProgressBar = Object.assign(ProgressBarRoot, {
  Root: ProgressBarRoot,
  Output: ProgressBarOutput,
  Track: ProgressBarTrack,
  Fill: ProgressBarFill
});

export {ProgressBar, ProgressBarRoot, ProgressBarOutput, ProgressBarTrack, ProgressBarFill};
export type {
  ProgressBarRootProps,
  ProgressBarRootProps as ProgressBarProps,
  ProgressBarOutputProps,
  ProgressBarTrackProps,
  ProgressBarFillProps
} from "./types";
export {progressBarVariants, type ProgressBarVariants} from "@sail-ui/styles";
