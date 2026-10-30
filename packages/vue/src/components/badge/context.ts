import type {badgeVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface BadgeContext {
  slots: ComputedRef<ReturnType<typeof badgeVariants>>;
}

export const badgeContextKey: InjectionKey<BadgeContext> = Symbol("sail-badge");
