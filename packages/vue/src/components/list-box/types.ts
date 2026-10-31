import type {ListBoxVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

export type ListBoxKey = string | number;
export type ListBoxSelectionMode = "none" | "single" | "multiple";
export type ListBoxSelection = ListBoxKey | ListBoxKey[] | undefined;

export interface ListBoxRootProps {
  /**
   * The type of selection the list allows.
   * @default "single"
   */
  selectionMode?: ListBoxSelectionMode;
  /** The selected key(s) when the list is uncontrolled. */
  defaultValue?: ListBoxKey | ListBoxKey[];
  /** Keys that cannot be selected or activated. */
  disabledKeys?: Iterable<ListBoxKey>;
  /** Visual variant for the container. */
  variant?: ListBoxVariants["variant"];
  /** Custom key comparison passed to the collection. */
  by?: string | ((value: ListBoxKey, currentValue: ListBoxKey) => boolean);
  /**
   * Reserved for T08 virtualization. Accepted for API parity and currently
   * ignored.
   */
  isVirtualized?: boolean;
}

export type ListBoxRootEmits = {
  "selection-change": [value: ListBoxSelection];
  action: [value: ListBoxKey];
};

export interface ListBoxContext {
  selectionMode: ComputedRef<ListBoxSelectionMode>;
  selectedValue: ComputedRef<ListBoxSelection>;
  disabledKeys: ComputedRef<ReadonlySet<ListBoxKey>>;
  isSelected: (value: ListBoxKey) => boolean;
  isDisabled: (value: ListBoxKey) => boolean;
  setSelected: (value: ListBoxSelection) => void;
  emitAction: (value: ListBoxKey) => void;
}
