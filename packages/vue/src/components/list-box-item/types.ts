import type {ListBoxItemVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

import type {ListBoxKey} from "../list-box/types";

export interface ListBoxItemProps {
  /** Identifies the item and is emitted by selection and action events. */
  value: ListBoxKey;
  /** Accessible name used when the item has no `Label`. */
  textValue?: string;
  /** Disables this item without affecting the others. */
  isDisabled?: boolean;
  variant?: ListBoxItemVariants["variant"];
}

export interface ListBoxItemIndicatorProps {}

export interface ListBoxItemContext {
  isSelected: ComputedRef<boolean>;
  indicatorClass: ComputedRef<string>;
}
