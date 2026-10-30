import ToolbarRoot from "./toolbar-root.vue";

const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
});

export {Toolbar, ToolbarRoot};
export type {ToolbarRootProps, ToolbarRootProps as ToolbarProps} from "./types";
export {toolbarVariants, type ToolbarVariants} from "@sail-ui/styles";
