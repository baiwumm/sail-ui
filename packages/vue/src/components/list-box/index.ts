import {ListBoxItem, ListBoxItemIndicator} from "../list-box-item";
import {ListBoxSection} from "../list-box-section";

import ListBoxRoot from "./list-box-root.vue";

const ListBox = Object.assign(ListBoxRoot, {
  Root: ListBoxRoot,
  Item: ListBoxItem,
  ItemIndicator: ListBoxItemIndicator,
  Section: ListBoxSection,
});

export {ListBox, ListBoxRoot, ListBoxItem, ListBoxItemIndicator, ListBoxSection};
export type {
  ListBoxRootProps,
  ListBoxRootProps as ListBoxProps,
  ListBoxRootEmits,
  ListBoxContext,
  ListBoxKey,
  ListBoxSelection,
  ListBoxSelectionMode,
} from "./types";
export type {
  ListBoxItemProps,
  ListBoxItemProps as ListBoxItemRootProps,
  ListBoxItemIndicatorProps,
  ListBoxItemContext,
} from "../list-box-item/types";
export type {
  ListBoxSectionProps,
  ListBoxSectionProps as ListBoxSectionRootProps,
} from "../list-box-section/types";
export {listboxVariants, type ListBoxVariants} from "@sail-ui/styles";
