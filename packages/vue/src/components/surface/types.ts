import type {SurfaceVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface SurfaceProps extends PolymorphicProps {
  variant?: SurfaceVariants["variant"];
}
