import SurfaceRoot from "./surface.vue";

const Surface = Object.assign(SurfaceRoot, {
  Root: SurfaceRoot,
});

export {Surface, SurfaceRoot};
export type {SurfaceProps} from "./types";
export {surfaceVariants, type SurfaceVariants} from "@sail-ui/styles";
