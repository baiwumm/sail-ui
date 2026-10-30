import type {PressEvent} from "@sail-ui/primitives";
import type {VNode} from "vue";

import type {PolymorphicProps} from "../../shared/types";

export interface BreadcrumbsRootProps extends PolymorphicProps {
  isDisabled?: boolean;
  separator?: string | number | VNode;
}

export interface BreadcrumbsItemProps {
  href?: string;
  isDisabled?: boolean;
  onPress?: (event: PressEvent) => void;
  target?: string;
  rel?: string;
  download?: string | boolean;
  hreflang?: string;
  type?: string;
  referrerpolicy?: string;
  ping?: string;
}

/** Applied by BreadcrumbsRoot to the last item. */
export interface BreadcrumbsItemInternalProps extends BreadcrumbsItemProps {
  isCurrent?: boolean;
}
