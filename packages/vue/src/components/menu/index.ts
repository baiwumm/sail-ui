import {MenuItem, MenuItemIndicator, MenuItemSubmenuIndicator} from "../menu-item";
import {MenuSection} from "../menu-section";

import MenuRoot from "./menu-root.vue";

const Menu = Object.assign(MenuRoot, {
  Root: MenuRoot,
  Item: MenuItem,
  ItemIndicator: MenuItemIndicator,
  SubmenuIndicator: MenuItemSubmenuIndicator,
  Section: MenuSection,
});

export {Menu, MenuRoot, MenuItem, MenuItemIndicator, MenuItemSubmenuIndicator, MenuSection};
export type {
  MenuRootProps,
  MenuRootProps as MenuProps,
  MenuRootEmits,
  MenuSelectionContext,
  MenuKey,
  MenuSelection,
  MenuSelectionMode,
  MenuIdentity,
  MenuSubmenuContext,
  MenuSurfaceContext,
} from "./types";
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
export {menuVariants, type MenuVariants} from "@sail-ui/styles";
export {menuItemVariants, type MenuItemVariants} from "@sail-ui/styles";
export {menuSectionVariants, type MenuSectionVariants} from "@sail-ui/styles";
