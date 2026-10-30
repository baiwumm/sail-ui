import type {breadcrumbsVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, VNode} from "vue";

export interface BreadcrumbsContext {
  slots: ComputedRef<ReturnType<typeof breadcrumbsVariants>>;
  separator: ComputedRef<string | number | VNode | undefined>;
  isDisabled: ComputedRef<boolean>;
}

export const breadcrumbsContextKey: InjectionKey<BreadcrumbsContext> = Symbol("sail-breadcrumbs");
