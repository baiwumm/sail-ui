import PaginationContent from "./pagination-content.vue";
import PaginationEllipsis from "./pagination-ellipsis.vue";
import PaginationItem from "./pagination-item.vue";
import PaginationLink from "./pagination-link.vue";
import PaginationNextIcon from "./pagination-next-icon.vue";
import PaginationNext from "./pagination-next.vue";
import PaginationPreviousIcon from "./pagination-previous-icon.vue";
import PaginationPrevious from "./pagination-previous.vue";
import PaginationRoot from "./pagination-root.vue";
import PaginationSummary from "./pagination-summary.vue";

const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  Summary: PaginationSummary,
  Content: PaginationContent,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  PreviousIcon: PaginationPreviousIcon,
  Next: PaginationNext,
  NextIcon: PaginationNextIcon,
  Ellipsis: PaginationEllipsis,
});

export {
  Pagination,
  PaginationRoot,
  PaginationSummary,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationNext,
  PaginationNextIcon,
  PaginationEllipsis,
};
export type {
  PaginationRootProps,
  PaginationRootProps as PaginationProps,
  PaginationSummaryProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationLinkEmits,
  PaginationPreviousProps,
  PaginationPreviousEmits,
  PaginationPreviousIconProps,
  PaginationNextProps,
  PaginationNextEmits,
  PaginationNextIconProps,
  PaginationEllipsisProps,
  PaginationContext,
} from "./types";
export {paginationVariants, type PaginationVariants} from "@sail-ui/styles";
