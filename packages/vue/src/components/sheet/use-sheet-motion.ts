import type {ComputedRef, Ref} from "vue";
import {onScopeDispose, watch} from "vue";

import type {SheetPlacement} from "./context";

const PANEL_DURATION = 500;
const PANEL_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const BACKDROP_ENTER_DURATION = 250;
const BACKDROP_EXIT_DURATION = 200;

const prefersReducedMotion = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return Boolean(window.matchMedia("(prefers-reduced-motion: reduce)")?.matches);
};

export function sheetOffset(placement: SheetPlacement) {
  switch (placement) {
    case "top":
      return "translateY(-100%)";
    case "left":
      return "translateX(-100%)";
    case "right":
      return "translateX(100%)";
    default:
      return "translateY(100%)";
  }
}

/**
 * The upstream Sheet slides through React Aria's scroll-snap container. Sail
 * uses the same release curve (0.5s, cubic-bezier(0.32, 0.72, 0, 1)) as a
 * Web Animations slide so the panel enters and leaves from its edge.
 */
export function useSheetPanelMotion(
  elementRef: Ref<HTMLElement | null>,
  placement: ComputedRef<SheetPlacement>,
  isEntering: Ref<boolean>,
  isExiting: Ref<boolean>,
) {
  let animation: Animation | null = null;

  const cancel = () => {
    animation?.cancel();
    animation = null;
  };

  watch(
    [elementRef, isEntering, isExiting],
    ([element, entering, exiting]) => {
      if (!element || (!entering && !exiting) || prefersReducedMotion()) {
        return;
      }

      if (typeof element.animate !== "function") {
        return;
      }

      cancel();

      const offset = sheetOffset(placement.value);

      if (entering) {
        animation = element.animate([{transform: offset}, {transform: "translate(0, 0)"}], {
          duration: PANEL_DURATION,
          easing: PANEL_EASING,
        });
        return;
      }

      // A dismissed drag keeps its inline offset so the exit continues from it.
      const from = element.style.transform || "translate(0, 0)";

      element.style.transform = "";
      animation = element.animate([{transform: from}, {transform: offset}], {
        duration: PANEL_DURATION,
        easing: PANEL_EASING,
      });
    },
    {flush: "post"},
  );

  onScopeDispose(cancel);
}

export function useSheetBackdropMotion(
  elementRef: Ref<HTMLElement | null>,
  isEntering: Ref<boolean>,
  isExiting: Ref<boolean>,
) {
  let animation: Animation | null = null;

  const cancel = () => {
    animation?.cancel();
    animation = null;
  };

  watch(
    [elementRef, isEntering, isExiting],
    ([element, entering, exiting]) => {
      if (!element || (!entering && !exiting) || prefersReducedMotion()) {
        return;
      }

      if (typeof element.animate !== "function") {
        return;
      }

      cancel();

      animation = element.animate([{opacity: entering ? 0 : 1}, {opacity: entering ? 1 : 0}], {
        duration: entering ? BACKDROP_ENTER_DURATION : BACKDROP_EXIT_DURATION,
        easing: PANEL_EASING,
      });
    },
    {flush: "post"},
  );

  onScopeDispose(cancel);
}
