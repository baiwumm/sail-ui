import type {fieldsetVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey} from "vue";

export interface FieldsetContext {
  slots: ComputedRef<ReturnType<typeof fieldsetVariants>>;
  isDisabled: ComputedRef<boolean>;
}

export const fieldsetContextKey: InjectionKey<FieldsetContext> = Symbol("sail-fieldset");
