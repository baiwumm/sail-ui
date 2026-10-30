import type {ChipVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface ChipRootProps extends PolymorphicProps {
  color?: ChipVariants["color"];
  size?: ChipVariants["size"];
  variant?: ChipVariants["variant"];
}

export interface ChipLabelProps extends PolymorphicProps {}
