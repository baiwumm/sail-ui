import AlertRoot from "./alert-root.vue";
import AlertContent from "./alert-content.vue";
import AlertDescription from "./alert-description.vue";
import AlertIndicator from "./alert-indicator.vue";
import AlertTitle from "./alert-title.vue";

const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
});

export {Alert, AlertRoot, AlertIndicator, AlertContent, AlertTitle, AlertDescription};
export type {
  AlertRootProps,
  AlertIndicatorProps,
  AlertContentProps,
  AlertTitleProps,
  AlertDescriptionProps,
} from "./types";
export {alertVariants, type AlertVariants} from "@sail-ui/styles";
