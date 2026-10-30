import type {alertVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface AlertContext {
  slots: ComputedRef<ReturnType<typeof alertVariants>>;
  status: ComputedRef<string | undefined>;
}

export const alertContextKey: InjectionKey<AlertContext> = Symbol("sail-alert");
