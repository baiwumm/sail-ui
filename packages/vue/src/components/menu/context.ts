import type {InjectionKey} from "vue";

import {inject} from "vue";

import type {
  MenuIdentity,
  MenuSelectionContext,
  MenuSubmenuContext,
  MenuSurfaceContext,
} from "./types";

export const menuSelectionContextKey: InjectionKey<MenuSelectionContext> = Symbol("sail-menu");

export const menuIdentityKey: InjectionKey<MenuIdentity> = Symbol("sail-menu-identity");

export const menuSurfaceContextKey: InjectionKey<MenuSurfaceContext> = Symbol("sail-menu-surface");

/**
 * A `null` value is provided intentionally by `DropdownPopover` so items nested
 * inside a submenu popover are not mistaken for submenu triggers themselves.
 */
export const menuSubmenuContextKey: InjectionKey<MenuSubmenuContext | null> =
  Symbol("sail-menu-submenu");

export function useMenuSelectionContext(): MenuSelectionContext {
  const context = inject(menuSelectionContextKey, null);

  if (!context) {
    throw new Error("Menu items must be used inside <Menu> or <DropdownMenu>.");
  }

  return context;
}
