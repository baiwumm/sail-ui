import type {ScrollShadowVariants} from "@sail-ui/styles";

import type {PolymorphicProps} from "../../shared/types";

export type ScrollShadowVisibility = "auto" | "both" | "top" | "bottom" | "left" | "right" | "none";

export type ScrollShadowOrientation = "vertical" | "horizontal";

export interface ScrollShadowRootProps extends PolymorphicProps {
  /**
   * The shadow size in pixels.
   * @default 40
   */
  size?: number;
  /**
   * The scroll offset before showing shadows (in pixels).
   * @default 0
   */
  offset?: number;
  /**
   * Controlled shadow visibility state.
   * @default "auto"
   */
  visibility?: ScrollShadowVisibility;
  /**
   * Whether scroll shadow detection is enabled.
   * @default true
   */
  isEnabled?: boolean;
  /**
   * The axis observed for overflow.
   * @default "vertical"
   */
  orientation?: ScrollShadowOrientation;
  variant?: ScrollShadowVariants["variant"];
  /**
   * Whether the native scrollbar is hidden.
   * @default false
   */
  hideScrollBar?: boolean;
}
