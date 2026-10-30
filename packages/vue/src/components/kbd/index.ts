import KbdAbbr from "./kbd-abbr.vue";
import KbdContent from "./kbd-content.vue";
import {kbdKeysLabelMap, kbdKeysMap} from "./kbd.constants";
import KbdRoot from "./kbd-root.vue";

const Kbd = Object.assign(KbdRoot, {
  Root: KbdRoot,
  Abbr: KbdAbbr,
  Content: KbdContent,
});

export {Kbd, KbdRoot, KbdAbbr, KbdContent, kbdKeysMap, kbdKeysLabelMap};
export type {KbdKey} from "./kbd.constants";
export type {KbdRootProps, KbdRootProps as KbdProps, KbdAbbrProps, KbdContentProps} from "./types";
export {kbdVariants, type KbdVariants} from "@sail-ui/styles";
