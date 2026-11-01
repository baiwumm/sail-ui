import type {SeparatorVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

import type {PolymorphicProps} from "../../shared/types";

export interface SeparatorRootProps extends PolymorphicProps {
  orientation?: SeparatorVariants["orientation"];
  variant?: SeparatorVariants["variant"];
  /** Whether the divider is purely visual and hidden from assistive technology. @default false */
  isDecorative?: boolean;
  elementType?: string;
}

/**
 * Provided by the toolbar: inner separators render with the orientation
 * flipped relative to the toolbar (upstream SeparatorContext).
 */
export interface SeparatorToolbarContext {
  orientation: Ref<SeparatorVariants["orientation"]>;
}

export const separatorToolbarContextKey: InjectionKey<SeparatorToolbarContext> =
  Symbol("sail-separator-toolbar");
