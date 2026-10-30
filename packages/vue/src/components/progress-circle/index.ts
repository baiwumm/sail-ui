import ProgressCircleFillCircle from "./progress-circle-fill-circle.vue";
import ProgressCircleRoot from "./progress-circle-root.vue";
import ProgressCircleTrackCircle from "./progress-circle-track-circle.vue";
import ProgressCircleTrack from "./progress-circle-track.vue";

const ProgressCircle = Object.assign(ProgressCircleRoot, {
  Root: ProgressCircleRoot,
  Track: ProgressCircleTrack,
  TrackCircle: ProgressCircleTrackCircle,
  FillCircle: ProgressCircleFillCircle
});

export {
  ProgressCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  ProgressCircleFillCircle
};
export type {
  ProgressCircleRootProps,
  ProgressCircleRootProps as ProgressCircleProps,
  ProgressCircleTrackProps,
  ProgressCircleTrackCircleProps,
  ProgressCircleFillCircleProps
} from "./types";
export {progressCircleVariants, type ProgressCircleVariants} from "@sail-ui/styles";
