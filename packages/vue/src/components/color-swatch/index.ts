import ColorSwatchRoot from "./color-swatch.vue";

const ColorSwatch = Object.assign(ColorSwatchRoot, {
  Root: ColorSwatchRoot,
});

export {ColorSwatch, ColorSwatchRoot};

export type {ColorSwatchProps, ColorSwatchProps as ColorSwatchRootProps} from "./types";

export {colorSwatchVariants, type ColorSwatchVariants} from "@sail-ui/styles";
