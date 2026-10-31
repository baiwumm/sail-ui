import type {UseOverlayStateReturn} from "@sail-ui/primitives";
import type {dateRangePickerVariants} from "@sail-ui/styles";
import type {ComputedRef, InjectionKey, Ref} from "vue";

import {inject} from "vue";

export interface DateRangePickerContext {
  slots: ComputedRef<ReturnType<typeof dateRangePickerVariants>>;
  triggerRef: Ref<HTMLElement | null>;
  anchorRef: Ref<HTMLElement | null>;
  overlay: UseOverlayStateReturn;
  labelId: string;
}

export const dateRangePickerContextKey: InjectionKey<DateRangePickerContext> =
  Symbol("sail-date-range-picker");

export function useDateRangePickerContext() {
  const context = inject(dateRangePickerContextKey);

  if (!context) {
    throw new Error("DateRangePicker parts must be used inside <DateRangePickerRoot>.");
  }

  return context;
}
