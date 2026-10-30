import type {cardVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface CardContext {
  slots: ComputedRef<ReturnType<typeof cardVariants>>;
}

export const cardContextKey: InjectionKey<CardContext> = Symbol("sail-card");
