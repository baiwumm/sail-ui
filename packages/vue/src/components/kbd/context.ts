import type {kbdVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface KbdContext {
  slots: ComputedRef<ReturnType<typeof kbdVariants>>;
}

export const kbdContextKey: InjectionKey<KbdContext> = Symbol("sail-kbd");
