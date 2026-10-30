import BreadcrumbsItem from "./breadcrumbs-item.vue";
import BreadcrumbsRoot from "./breadcrumbs-root.vue";

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Root: BreadcrumbsRoot,
  Item: BreadcrumbsItem
});

export {Breadcrumbs, BreadcrumbsRoot, BreadcrumbsItem};
export type {
  BreadcrumbsRootProps,
  BreadcrumbsRootProps as BreadcrumbsProps,
  BreadcrumbsItemProps
} from "./types";
export {breadcrumbsVariants, type BreadcrumbsVariants} from "@sail-ui/styles";
