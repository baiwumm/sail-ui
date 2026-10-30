import type {linkVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface LinkContext {
  slots: ComputedRef<ReturnType<typeof linkVariants>>;
}

export const linkContextKey: InjectionKey<LinkContext> = Symbol("sail-link");
