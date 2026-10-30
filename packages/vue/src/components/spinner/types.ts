import type {SpinnerVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface SpinnerRootProps extends PolymorphicProps {
  color?: SpinnerVariants["color"];
  size?: SpinnerVariants["size"];
}
