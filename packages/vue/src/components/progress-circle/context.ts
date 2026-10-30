import type {progressCircleVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export const STROKE_WIDTH = 4;
export const CENTER = 18;
export const RADIUS = CENTER - STROKE_WIDTH / 2;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export interface ProgressCircleContext {
  slots: ComputedRef<ReturnType<typeof progressCircleVariants>>;
  percentage: ComputedRef<number | undefined>;
  isIndeterminate: ComputedRef<boolean>;
}

export const progressCircleContextKey: InjectionKey<ProgressCircleContext> =
  Symbol("sail-progress-circle");
