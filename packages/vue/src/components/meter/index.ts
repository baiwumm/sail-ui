import MeterFill from "./meter-fill.vue";
import MeterOutput from "./meter-output.vue";
import MeterRoot from "./meter-root.vue";
import MeterTrack from "./meter-track.vue";

const Meter = Object.assign(MeterRoot, {
  Root: MeterRoot,
  Output: MeterOutput,
  Track: MeterTrack,
  Fill: MeterFill,
});

export {Meter, MeterRoot, MeterOutput, MeterTrack, MeterFill};
export type {
  MeterRootProps,
  MeterRootProps as MeterProps,
  MeterOutputProps,
  MeterTrackProps,
  MeterFillProps,
} from "./types";
export {meterVariants, type MeterVariants} from "@sail-ui/styles";
