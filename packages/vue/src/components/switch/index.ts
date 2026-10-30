import SwitchContent from "./switch-content.vue";
import SwitchControl from "./switch-control.vue";
import SwitchIcon from "./switch-icon.vue";
import SwitchRoot from "./switch-root.vue";
import SwitchThumb from "./switch-thumb.vue";

const Switch = Object.assign(SwitchRoot, {
  Root: SwitchRoot,
  Content: SwitchContent,
  Control: SwitchControl,
  Thumb: SwitchThumb,
  Icon: SwitchIcon,
});

export {Switch, SwitchRoot, SwitchContent, SwitchControl, SwitchThumb, SwitchIcon};
export type {
  SwitchRootProps,
  SwitchRootProps as SwitchProps,
  SwitchContentProps,
  SwitchControlProps,
  SwitchThumbProps,
  SwitchIconProps,
} from "./types";
export {switchVariants, type SwitchVariants} from "@sail-ui/styles";
