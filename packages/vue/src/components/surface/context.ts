import type {SurfaceVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export const surfaceContextKey: InjectionKey<ComputedRef<SurfaceVariants["variant"] | undefined>> =
  Symbol("sail-surface");
