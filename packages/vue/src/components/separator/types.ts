import type {SeparatorVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export interface SeparatorRootProps extends PolymorphicProps {
  orientation?: SeparatorVariants["orientation"];
  variant?: SeparatorVariants["variant"];
  /** Whether the divider is purely visual and hidden from assistive technology. @default false */
  isDecorative?: boolean;
  elementType?: string;
}
