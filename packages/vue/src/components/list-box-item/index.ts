import ListBoxItemIndicator from "./list-box-item-indicator.vue";
import ListBoxItemRoot from "./list-box-item.vue";

const ListBoxItem = Object.assign(ListBoxItemRoot, {
  Root: ListBoxItemRoot,
  Indicator: ListBoxItemIndicator,
});

export {ListBoxItem, ListBoxItemRoot, ListBoxItemIndicator};
export type {
  ListBoxItemProps,
  ListBoxItemProps as ListBoxItemRootProps,
  ListBoxItemIndicatorProps,
  ListBoxItemContext,
} from "./types";
export {listboxItemVariants, type ListBoxItemVariants} from "@sail-ui/styles";
