import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {ComputedRef, Ref} from "vue";

export type MenuKey = string | number;
export type MenuSelectionMode = "none" | "single" | "multiple";
export type MenuSelection = MenuKey | MenuKey[] | undefined;

export interface MenuRootProps {
  /**
   * The type of selection the menu allows.
   * @default "none"
   */
  selectionMode?: MenuSelectionMode;
  /** The selected key(s) when the menu is uncontrolled. */
  defaultValue?: MenuSelection;
  /** Keys that cannot be activated. */
  disabledKeys?: Iterable<MenuKey>;
  /**
   * Whether activating an item closes the menu.
   * @default selectionMode !== "multiple"
   */
  shouldCloseOnSelect?: boolean;
  /**
   * Prevent a multiple selection menu from reaching an empty selection.
   * @default false
   */
  disallowEmptySelection?: boolean;
}

export type MenuRootEmits = {
  "selection-change": [value: MenuSelection];
  action: [key: MenuKey];
};

export interface MenuSelectionContext {
  selectionMode: ComputedRef<MenuSelectionMode>;
  selectedValue: ComputedRef<MenuSelection>;
  disabledKeys: ComputedRef<ReadonlySet<MenuKey>>;
  shouldCloseOnSelect: ComputedRef<boolean>;
  disallowEmptySelection: ComputedRef<boolean>;
  isSelected: (key: MenuKey) => boolean;
  isDisabled: (key: MenuKey) => boolean;
  select: (key: MenuKey) => void;
  emitAction: (key: MenuKey) => void;
  activate: (key: MenuKey) => void;
}

export interface MenuIdentity {
  triggerId: Ref<string>;
  menuId: string;
}

/** Provided by the popover that owns the menu surface. */
export interface MenuSurfaceContext {
  close: () => void;
}

/** Marker for the item and popover directly inside a submenu trigger. */
export interface MenuSubmenuContext {
  overlay: UseOverlayStateReturn;
  triggerId: string;
  menuId: string;
  isOpen: Readonly<Ref<boolean>>;
}
