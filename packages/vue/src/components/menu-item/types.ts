import type {MenuItemVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

import type {MenuKey} from "../menu/types";

export interface MenuItemProps {
  /** Identifies the item and is emitted by action and selection events. */
  value: MenuKey;
  /** Accessible name and typeahead text used when the item has no `Label`. */
  textValue?: string;
  /** Disables this item without affecting the others. */
  isDisabled?: boolean;
  variant?: MenuItemVariants["variant"];
}

export interface MenuItemIndicatorProps {
  /**
   * The selection indicator shape.
   * @default "checkmark"
   */
  type?: "checkmark" | "dot";
}

export interface MenuItemSubmenuIndicatorProps {}

export interface MenuItemContext {
  isSelected: ComputedRef<boolean>;
  hasSubmenu: ComputedRef<boolean>;
  isSubmenuOpen: ComputedRef<boolean>;
  indicatorClass: ComputedRef<string>;
  submenuIndicatorClass: ComputedRef<string>;
}
