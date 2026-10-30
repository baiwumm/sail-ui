import type {ComputedRef, InjectionKey, Ref} from "vue";

import type {tooltipVariants} from "@sail-ui/styles";

import {inject} from "vue";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipTriggerMode = "hover" | "focus";

export interface TooltipContext {
  slots: ComputedRef<ReturnType<typeof tooltipVariants>>;
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  isDisabled: ComputedRef<boolean>;
  triggerMode: ComputedRef<TooltipTriggerMode>;
  contentRef: Ref<HTMLElement | null>;
  triggerRef: Ref<HTMLElement | null>;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelScheduled: () => void;
  openNow: () => void;
}

export const tooltipContextKey: InjectionKey<TooltipContext> = Symbol("sail-tooltip");

export function useTooltipContext() {
  const context = inject(tooltipContextKey);

  if (!context) {
    throw new Error("Tooltip parts must be used inside <TooltipRoot>.");
  }

  return context;
}
