import EmptyStateRoot from "./empty-state.vue";

const EmptyState = Object.assign(EmptyStateRoot, {
  Root: EmptyStateRoot,
});

export {EmptyState, EmptyStateRoot};
export type {EmptyStateRootProps, EmptyStateRootProps as EmptyStateProps} from "./types";
export {emptyStateVariants, type EmptyStateVariants} from "@sail-ui/styles";
