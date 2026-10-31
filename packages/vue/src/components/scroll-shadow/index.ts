import ScrollShadowRoot from "./scroll-shadow.vue";

const ScrollShadow = Object.assign(ScrollShadowRoot, {
  Root: ScrollShadowRoot,
});

export {ScrollShadow, ScrollShadowRoot};
export type {
  ScrollShadowRootProps,
  ScrollShadowRootProps as ScrollShadowProps,
  ScrollShadowVisibility,
  ScrollShadowOrientation,
} from "./types";
export {scrollShadowVariants, type ScrollShadowVariants} from "@sail-ui/styles";
export {useScrollShadow, type UseScrollShadowProps} from "./use-scroll-shadow";
