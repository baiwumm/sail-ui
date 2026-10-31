import type {PressEvent} from "@sail-ui/primitives";
import type {Ref} from "vue";

export interface DisclosureRootProps {
  /** The controlled expanded state. Use `v-model:open`. */
  open?: boolean;
  /** Whether the disclosure is expanded when it is uncontrolled. */
  defaultOpen?: boolean;
  isDisabled?: boolean;
  /** Identifies the disclosure inside a `DisclosureGroup`. Generated when omitted. */
  id?: string;
}

export interface DisclosureHeadingProps {}

export interface DisclosureTriggerProps {}

export interface DisclosureTriggerEmits {
  press: [event: PressEvent];
}

export interface DisclosureContentProps {}

export interface DisclosureBodyProps {}

export interface DisclosureIndicatorProps {}

export interface DisclosureContext {
  isExpanded: Ref<boolean>;
  isDisabled: Ref<boolean>;
  triggerId: string;
  contentId: string;
  toggle: () => void;
}
