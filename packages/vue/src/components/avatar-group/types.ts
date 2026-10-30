import type {AvatarGroupVariants, AvatarVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";
import type {AvatarRootProps} from "../avatar/types";

export interface AvatarGroupRootProps extends PolymorphicProps {
  // Plain boolean so the runtime compiler casts the `is-grid` shorthand.
  isGrid?: boolean;
  overlap?: AvatarGroupVariants["overlap"];
  size?: AvatarVariants["size"];
  color?: AvatarVariants["color"];
  variant?: AvatarVariants["variant"];
  max?: number;
}

export interface AvatarGroupCountProps extends AvatarRootProps {}
