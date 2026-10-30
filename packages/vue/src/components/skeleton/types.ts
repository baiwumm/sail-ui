import type {SkeletonVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface SkeletonRootProps extends PolymorphicProps {
  animationType?: SkeletonVariants["animationType"];
}
