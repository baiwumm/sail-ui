import type {meterVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface MeterContext {
  slots: ComputedRef<ReturnType<typeof meterVariants>>;
  percentage: ComputedRef<number | undefined>;
  valueText: ComputedRef<string | undefined>;
  showValueLabel: ComputedRef<boolean>;
}

export const meterContextKey: InjectionKey<MeterContext> = Symbol("sail-meter");
