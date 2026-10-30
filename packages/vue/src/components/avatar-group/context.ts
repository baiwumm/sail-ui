import type {AvatarVariants, avatarGroupVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface AvatarGroupContext {
  slots: ComputedRef<ReturnType<typeof avatarGroupVariants>>;
  size: ComputedRef<AvatarVariants["size"] | undefined>;
  color: ComputedRef<AvatarVariants["color"] | undefined>;
  variant: ComputedRef<AvatarVariants["variant"] | undefined>;
}

export const avatarGroupContextKey: InjectionKey<AvatarGroupContext> = Symbol("sail-avatar-group");
