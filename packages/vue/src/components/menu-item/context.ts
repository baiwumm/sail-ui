import type {InjectionKey} from "vue";

import {inject} from "vue";

import type {MenuItemContext} from "./types";

export const menuItemContextKey: InjectionKey<MenuItemContext> = Symbol("sail-menu-item");

export function useMenuItemContext(): MenuItemContext {
  const context = inject(menuItemContextKey, null);

  if (!context) {
    throw new Error("MenuItem indicators must be used inside <MenuItem>.");
  }

  return context;
}
