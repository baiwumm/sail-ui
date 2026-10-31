import type {PressEvent} from "@sail-ui/primitives";
import type {tabsVariants, TabsVariants} from "@sail-ui/styles";
import type {ComputedRef, Ref} from "vue";

export type TabsKey = string | number;
export type TabsOrientation = "horizontal" | "vertical";

export interface TabsRootProps {
  /** Aligns tab labels inside their pill. */
  align?: TabsVariants["align"];
  /**
   * The visual variant of the tab list.
   * @default "primary"
   */
  variant?: TabsVariants["variant"];
  /** @default "horizontal" */
  orientation?: TabsOrientation;
  /** Whether arrow keys select immediately or wait for Enter/Space. @default "automatic" */
  activationMode?: "automatic" | "manual";
  /** The tab selected when the tabs are uncontrolled. */
  defaultSelectedKey?: TabsKey;
  /** Disables every tab. */
  isDisabled?: boolean;
}

export interface TabsRootEmits {
  "selection-change": [value: TabsKey];
}

export interface TabsListContainerProps {}

export interface TabsListProps {}

export interface TabsTabProps {
  /** Identifies the tab inside `v-model` and links it to its panel. */
  value: TabsKey;
  /** Disables this tab without affecting the others. */
  isDisabled?: boolean;
}

export interface TabsTabEmits {
  press: [event: PressEvent];
}

export interface TabsIndicatorProps {}

export interface TabsPanelProps {
  /** The tab this panel belongs to. */
  value: TabsKey;
  /** Keeps the panel mounted while another tab is selected. */
  forceMount?: boolean;
}

export interface TabsSeparatorProps {}

export interface TabsIndicatorSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface TabsContext {
  selectedKey: ComputedRef<TabsKey | undefined>;
  isDisabled: ComputedRef<boolean>;
  orientation: ComputedRef<TabsOrientation>;
  slots: ComputedRef<ReturnType<typeof tabsVariants>>;
  isIndicatorReady: Ref<boolean>;
  currentIndicatorEl: Ref<HTMLElement | null>;
  consumeIndicatorSnapshot: () => TabsIndicatorSnapshot | null;
  triggerId: (value: TabsKey) => string;
  contentId: (value: TabsKey) => string;
  select: (value: TabsKey) => void;
}

export interface TabItemContext {
  value: TabsKey;
  isSelected: ComputedRef<boolean>;
  triggerEl: Ref<HTMLElement | null>;
}
