import DisclosureBody from "./disclosure-body.vue";
import DisclosureContent from "./disclosure-content.vue";
import DisclosureHeading from "./disclosure-heading.vue";
import DisclosureIndicator from "./disclosure-indicator.vue";
import DisclosureRoot from "./disclosure-root.vue";
import DisclosureTrigger from "./disclosure-trigger.vue";

const Disclosure = Object.assign(DisclosureRoot, {
  Root: DisclosureRoot,
  Heading: DisclosureHeading,
  Trigger: DisclosureTrigger,
  Content: DisclosureContent,
  Body: DisclosureBody,
  Indicator: DisclosureIndicator,
});

export {
  Disclosure,
  DisclosureRoot,
  DisclosureHeading,
  DisclosureTrigger,
  DisclosureContent,
  DisclosureBody,
  DisclosureIndicator,
};
export type {
  DisclosureRootProps,
  DisclosureRootProps as DisclosureProps,
  DisclosureHeadingProps,
  DisclosureTriggerProps,
  DisclosureTriggerEmits,
  DisclosureContentProps,
  DisclosureBodyProps,
  DisclosureIndicatorProps,
} from "./types";
export {disclosureVariants, type DisclosureVariants} from "@sail-ui/styles";
