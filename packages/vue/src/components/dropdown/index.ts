import {MenuItem, MenuItemIndicator, MenuItemSubmenuIndicator} from "../menu-item";
import {MenuSection} from "../menu-section";

import DropdownRoot from "./dropdown-root.vue";
import DropdownTrigger from "./dropdown-trigger.vue";
import DropdownPopover from "./dropdown-popover.vue";
import DropdownMenu from "./dropdown-menu.vue";
import DropdownSubmenuTrigger from "./dropdown-submenu-trigger.vue";

const Dropdown = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Section: MenuSection,
  Item: MenuItem,
  ItemIndicator: MenuItemIndicator,
  SubmenuIndicator: MenuItemSubmenuIndicator,
  SubmenuTrigger: DropdownSubmenuTrigger,
});

export {
  Dropdown,
  DropdownRoot,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu,
  DropdownSubmenuTrigger,
};
export type {
  DropdownRootProps,
  DropdownTriggerProps,
  DropdownPopoverProps,
  DropdownMenuProps,
  DropdownMenuEmits,
  DropdownSide,
  DropdownSubmenuTriggerProps,
} from "./types";
export type {
  MenuKey,
  MenuSelection,
  MenuSelectionMode,
  MenuSelectionContext,
  MenuIdentity,
  MenuSubmenuContext,
  MenuSurfaceContext,
} from "../menu/types";
export type {
  MenuItemProps,
  MenuItemProps as MenuItemRootProps,
  MenuItemIndicatorProps,
  MenuItemSubmenuIndicatorProps,
  MenuItemContext,
} from "../menu-item/types";
export type {
  MenuSectionProps,
  MenuSectionProps as MenuSectionRootProps,
} from "../menu-section/types";
export {
  dropdownVariants,
  type DropdownVariants,
  menuItemVariants,
  type MenuItemVariants,
  menuSectionVariants,
  type MenuSectionVariants,
} from "@sail-ui/styles";
