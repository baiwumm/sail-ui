import type {BadgeVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface BadgeRootProps extends PolymorphicProps {
  color?: BadgeVariants["color"];
  placement?: BadgeVariants["placement"];
  size?: BadgeVariants["size"];
  variant?: BadgeVariants["variant"];
}

export interface BadgeLabelProps extends PolymorphicProps {}

export interface BadgeAnchorProps extends PolymorphicProps {}
