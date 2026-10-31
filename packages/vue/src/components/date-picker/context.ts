import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {datePickerVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import {inject} from "vue";

export interface DatePickerContext {
  slots: ComputedRef<ReturnType<typeof datePickerVariants>>;
  triggerRef: Ref<HTMLElement | null>;
  anchorRef: Ref<HTMLElement | null>;
  overlay: UseOverlayStateReturn;
  labelId: string;
}

export const datePickerContextKey: InjectionKey<DatePickerContext> = Symbol("sail-date-picker");

export function useDatePickerContext() {
  const context = inject(datePickerContextKey);

  if (!context) {
    throw new Error("DatePicker parts must be used inside <DatePickerRoot>.");
  }

  return context;
}
