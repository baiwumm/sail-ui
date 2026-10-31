import AccordionBody from "./accordion-body.vue";
import AccordionHeading from "./accordion-heading.vue";
import AccordionIndicator from "./accordion-indicator.vue";
import AccordionItem from "./accordion-item.vue";
import AccordionPanel from "./accordion-panel.vue";
import AccordionRoot from "./accordion-root.vue";
import AccordionTrigger from "./accordion-trigger.vue";

const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Heading: AccordionHeading,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Indicator: AccordionIndicator,
  Body: AccordionBody,
});

export {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionIndicator,
  AccordionBody,
};
export type {
  AccordionRootProps,
  AccordionRootProps as AccordionProps,
  AccordionItemProps,
  AccordionHeadingProps,
  AccordionTriggerProps,
  AccordionTriggerEmits,
  AccordionPanelProps,
  AccordionIndicatorProps,
  AccordionBodyProps,
} from "./types";
export {accordionVariants, type AccordionVariants} from "@sail-ui/styles";
