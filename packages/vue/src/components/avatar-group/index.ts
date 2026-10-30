import AvatarGroupCount from "./avatar-group-count.vue";
import AvatarGroupRoot from "./avatar-group.vue";

const AvatarGroup = Object.assign(AvatarGroupRoot, {
  Root: AvatarGroupRoot,
  Count: AvatarGroupCount,
});

export {AvatarGroup, AvatarGroupRoot, AvatarGroupCount};
export type {
  AvatarGroupRootProps,
  AvatarGroupRootProps as AvatarGroupProps,
  AvatarGroupCountProps,
} from "./types";
export {avatarGroupVariants, type AvatarGroupVariants} from "@sail-ui/styles";
