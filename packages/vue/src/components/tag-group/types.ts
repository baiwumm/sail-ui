import type {tagGroupVariants, TagVariants} from "@sail-ui/styles";
import type {ComputedRef} from "vue";

export type TagKey = string | number;
export type TagGroupSelectionMode = "none" | "single" | "multiple";
export type TagGroupSelection = TagKey | TagKey[] | undefined;
export type TagGroupEscapeKeyBehavior = "clearSelection" | "none";

export interface TagGroupRootProps {
  /**
   * The type of selection the group allows.
   * @default "none"
   */
  selectionMode?: TagGroupSelectionMode;
  /** The selected tag(s) when the group is uncontrolled. */
  defaultValue?: TagKey | TagKey[];
  /** Disables every tag in the group. */
  isDisabled?: boolean;
  /** Prevents deselecting the last selected tag. */
  disallowEmptySelection?: boolean;
  /**
   * Whether pressing Escape clears the selection.
   * @default "clearSelection"
   */
  escapeKeyBehavior?: TagGroupEscapeKeyBehavior;
  /**
   * Whether arrow keys wrap from the last tag to the first.
   * @default true
   */
  loop?: boolean;
  /** The size shared by every tag in the group. */
  size?: TagVariants["size"];
  /** The variant shared by every tag in the group. */
  variant?: TagVariants["variant"];
}

export type TagGroupRootEmits = {
  "selection-change": [value: TagGroupSelection];
  remove: [values: TagKey[]];
};

export interface TagGroupListProps {}

export interface TagGroupContext {
  slots: ComputedRef<ReturnType<typeof tagGroupVariants>>;
  selectionMode: ComputedRef<TagGroupSelectionMode>;
  selectedValue: ComputedRef<TagGroupSelection>;
  isDisabled: ComputedRef<boolean>;
  disallowEmptySelection: ComputedRef<boolean>;
  escapeKeyBehavior: ComputedRef<TagGroupEscapeKeyBehavior>;
  loop: ComputedRef<boolean>;
  size: ComputedRef<TagVariants["size"] | undefined>;
  variant: ComputedRef<TagVariants["variant"] | undefined>;
  canRemove: ComputedRef<boolean>;
  isSelected: (value: TagKey) => boolean;
  setSelected: (value: TagGroupSelection) => void;
  emitRemove: (values: TagKey[]) => void;
  requestRemove: (values: TagKey[]) => void;
  ariaLabel: ComputedRef<string | undefined>;
  ariaLabelledBy: ComputedRef<string | undefined>;
  ariaDescribedBy: ComputedRef<string | undefined>;
}
