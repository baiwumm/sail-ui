import type {chipVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface ChipContext {
  slots: ComputedRef<ReturnType<typeof chipVariants>>;
}

export const chipContextKey: InjectionKey<ChipContext> = Symbol("sail-chip");
