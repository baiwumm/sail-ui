import type {avatarVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface AvatarContext {
  slots: ComputedRef<ReturnType<typeof avatarVariants>>;
}

export const avatarContextKey: InjectionKey<AvatarContext> = Symbol("sail-avatar");
