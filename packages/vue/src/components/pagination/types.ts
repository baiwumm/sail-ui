import type {PressEvent} from "@sail-ui/primitives";
import type {PaginationVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

import type {paginationVariants} from "@sail-ui/styles";

export interface PaginationRootProps {
  /** Pagination size. @default "md" */
  size?: PaginationVariants["size"];
}

export interface PaginationSummaryProps {}

export interface PaginationContentProps {}

export interface PaginationItemProps {}

export interface PaginationLinkProps {
  /** Marks the current page with `aria-current="page"` and `data-active`. */
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface PaginationLinkEmits {
  press: [event: PressEvent];
}

export interface PaginationPreviousProps {
  isDisabled?: boolean;
}

export interface PaginationPreviousEmits {
  press: [event: PressEvent];
}

export interface PaginationPreviousIconProps {}

export interface PaginationNextProps {
  isDisabled?: boolean;
}

export interface PaginationNextEmits {
  press: [event: PressEvent];
}

export interface PaginationNextIconProps {}

export interface PaginationEllipsisProps {}

export interface PaginationContext {
  slots: ComputedRef<ReturnType<typeof paginationVariants>>;
}
