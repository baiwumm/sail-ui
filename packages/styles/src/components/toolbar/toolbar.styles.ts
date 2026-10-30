import type {VariantProps} from "tailwind-variants";

import {tv} from "tailwind-variants";

export const toolbarVariants = tv({
  base: "toolbar",
  defaultVariants: {
    isAttached: false,
    orientation: "horizontal"
  },
  variants: {
    isAttached: {
      true: "toolbar--attached"
    },
    orientation: {
      horizontal: "toolbar--horizontal",
      vertical: "toolbar--vertical"
    }
  }
});

export type ToolbarVariants = VariantProps<typeof toolbarVariants>;
