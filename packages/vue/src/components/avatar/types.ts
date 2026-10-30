import type {AvatarVariants} from "@sail-ui/styles";
import type {AvatarFallbackProps as RekaAvatarFallbackProps, AvatarImageProps as RekaAvatarImageProps} from "reka-ui";

import type {PolymorphicProps} from "../../shared/types";

export interface AvatarRootProps extends PolymorphicProps {
  color?: AvatarVariants["color"];
  size?: AvatarVariants["size"];
  variant?: AvatarVariants["variant"];
}

export interface AvatarImageProps extends RekaAvatarImageProps {}

export interface AvatarFallbackProps extends RekaAvatarFallbackProps {
  color?: AvatarVariants["color"];
}
