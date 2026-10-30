import type {ToolbarVariants} from "@sail-ui/styles";
import type {InjectionKey, Ref} from "vue";

export interface ToolbarRootProps {
  /**
   * The orientation of the toolbar.
   * @default "horizontal"
   */
  orientation?: ToolbarVariants["orientation"];
  /**
   * Whether the toolbar renders as a connected surface.
   */
  isAttached?: boolean;
  /**
   * The reading direction of the toolbar. Inherited from the document when
   * omitted.
   */
  dir?: "ltr" | "rtl";
}

export interface ToolbarContext {
  orientation: Ref<"horizontal" | "vertical">;
}

export const toolbarContextKey: InjectionKey<ToolbarContext> = Symbol("sail-toolbar");
