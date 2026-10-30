import SkeletonRoot from "./skeleton.vue";

const Skeleton = Object.assign(SkeletonRoot, {
  Root: SkeletonRoot,
});

export {Skeleton, SkeletonRoot};
export type {SkeletonRootProps, SkeletonRootProps as SkeletonProps} from "./types";
export {skeletonVariants, type SkeletonVariants} from "@sail-ui/styles";
