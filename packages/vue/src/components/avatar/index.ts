import AvatarFallback from "./avatar-fallback.vue";
import AvatarImage from "./avatar-image.vue";
import AvatarRoot from "./avatar-root.vue";

const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback
});

export {Avatar, AvatarRoot, AvatarImage, AvatarFallback};
export type {AvatarRootProps, AvatarRootProps as AvatarProps, AvatarImageProps, AvatarFallbackProps} from "./types";
export {avatarVariants, type AvatarVariants} from "@sail-ui/styles";
