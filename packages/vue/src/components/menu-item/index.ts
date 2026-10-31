import MenuItemRoot from "./menu-item.vue";
import MenuItemIndicator from "./menu-item-indicator.vue";
import MenuItemSubmenuIndicator from "./menu-item-submenu-indicator.vue";

const MenuItem = Object.assign(MenuItemRoot, {
  Root: MenuItemRoot,
  Indicator: MenuItemIndicator,
  SubmenuIndicator: MenuItemSubmenuIndicator,
});

export {MenuItem, MenuItemRoot, MenuItemIndicator, MenuItemSubmenuIndicator};
export type {
  MenuItemProps,
  MenuItemProps as MenuItemRootProps,
  MenuItemIndicatorProps,
  MenuItemSubmenuIndicatorProps,
  MenuItemContext,
} from "./types";
export {menuItemVariants, type MenuItemVariants} from "@sail-ui/styles";
