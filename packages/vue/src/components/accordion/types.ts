import type {PressEvent} from "@sail-ui/primitives";
import type {accordionVariants, AccordionVariants} from "@sail-ui/styles";
import type {ComputedRef, Ref} from "vue";

export interface AccordionRootProps {
  /**
   * The visual variant of the accordion.
   * @default "default"
   */
  variant?: AccordionVariants["variant"];
  /**
   * Hides the separator line painted under every item.
   * @default false
   */
  hideSeparator?: boolean;
  /** Whether every item is disabled. */
  isDisabled?: boolean;
  /**
   * Whether more than one item can stay expanded.
   * @default false
   */
  allowsMultipleExpanded?: boolean;
  /** The item ids expanded when the accordion is uncontrolled. */
  defaultExpandedKeys?: string[];
  /** @default "vertical" */
  orientation?: "vertical" | "horizontal";
}

export interface AccordionItemProps {
  /** Identifies the item inside `v-model:expanded-keys`. Generated when omitted. */
  id?: string;
  /** Disables this item without affecting the others. */
  isDisabled?: boolean;
}

export interface AccordionHeadingProps {}

export interface AccordionTriggerProps {}

export interface AccordionTriggerEmits {
  press: [event: PressEvent];
}

export interface AccordionPanelProps {}

export interface AccordionIndicatorProps {}

export interface AccordionBodyProps {}

export interface AccordionContext {
  expandedKeys: Ref<string[]>;
  allowsMultipleExpanded: Ref<boolean>;
  isDisabled: Ref<boolean>;
  hideSeparator: Ref<boolean>;
  orientation: Ref<"vertical" | "horizontal">;
  slots: ComputedRef<ReturnType<typeof accordionVariants>>;
  toggle: (id: string) => void;
}

export interface AccordionItemContext {
  isExpanded: Ref<boolean>;
  isDisabled: Ref<boolean>;
  triggerId: string;
  panelId: string;
  toggle: () => void;
}
