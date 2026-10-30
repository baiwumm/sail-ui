import type {progressBarVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface ProgressBarContext {
  slots: ComputedRef<ReturnType<typeof progressBarVariants>>;
  percentage: ComputedRef<number | undefined>;
  valueText: ComputedRef<string | undefined>;
  isIndeterminate: ComputedRef<boolean>;
}

export const progressBarContextKey: InjectionKey<ProgressBarContext> = Symbol("sail-progress-bar");
