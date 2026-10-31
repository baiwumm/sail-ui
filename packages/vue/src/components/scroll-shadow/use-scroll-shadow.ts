import {onBeforeUnmount, onMounted, toValue, watch, type MaybeRefOrGetter} from "vue";

import type {ScrollShadowOrientation, ScrollShadowVisibility} from "./types";

export interface UseScrollShadowProps {
  containerRef: MaybeRefOrGetter<HTMLElement | null | undefined>;
  orientation: MaybeRefOrGetter<ScrollShadowOrientation>;
  offset: MaybeRefOrGetter<number>;
  visibility: MaybeRefOrGetter<ScrollShadowVisibility>;
  isEnabled: MaybeRefOrGetter<boolean>;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

interface ScrollState {
  hasScrollBefore: boolean;
  hasScrollAfter: boolean;
}

export function useScrollShadow(props: UseScrollShadowProps) {
  let prevState: ScrollState | null = null;
  let rafId: number | null = null;
  let teardown: (() => void) | null = null;

  function notify(visibility: ScrollShadowVisibility) {
    props.onVisibilityChange?.(visibility);
  }

  function applyState(
    element: HTMLElement,
    isVertical: boolean,
    hasScrollBefore: boolean,
    hasScrollAfter: boolean,
  ) {
    if (isVertical) {
      if (hasScrollBefore && hasScrollAfter) {
        element.dataset["topBottomScroll"] = "true";
        delete element.dataset["topScroll"];
        delete element.dataset["bottomScroll"];
      } else {
        element.dataset["topScroll"] = String(hasScrollBefore);
        element.dataset["bottomScroll"] = String(hasScrollAfter);
        delete element.dataset["topBottomScroll"];
      }
    } else if (hasScrollBefore && hasScrollAfter) {
      element.dataset["leftRightScroll"] = "true";
      delete element.dataset["leftScroll"];
      delete element.dataset["rightScroll"];
    } else {
      element.dataset["leftScroll"] = String(hasScrollBefore);
      element.dataset["rightScroll"] = String(hasScrollAfter);
      delete element.dataset["leftRightScroll"];
    }
  }

  function reportState(isVertical: boolean, hasScrollBefore: boolean, hasScrollAfter: boolean) {
    if (isVertical) {
      if (hasScrollBefore && hasScrollAfter) {
        notify("both");
      } else if (hasScrollBefore) {
        notify("top");
      } else if (hasScrollAfter) {
        notify("bottom");
      } else {
        notify("none");
      }
    } else if (hasScrollBefore && hasScrollAfter) {
      notify("both");
    } else if (hasScrollBefore) {
      notify("left");
    } else if (hasScrollAfter) {
      notify("right");
    } else {
      notify("none");
    }
  }

  function checkOverflow() {
    const element = toValue(props.containerRef);

    if (!element) {
      return;
    }

    const isVertical = toValue(props.orientation) === "vertical";
    const offset = toValue(props.offset);
    const scrollStart = isVertical ? element.scrollTop : Math.abs(element.scrollLeft);
    const scrollSize = isVertical ? element.scrollHeight : element.scrollWidth;
    const clientSize = isVertical ? element.clientHeight : element.clientWidth;
    const hasScrollBefore = scrollStart > offset;
    const hasScrollAfter = scrollStart + clientSize + offset < scrollSize - 1;

    if (
      prevState &&
      prevState.hasScrollBefore === hasScrollBefore &&
      prevState.hasScrollAfter === hasScrollAfter
    ) {
      return;
    }

    prevState = {hasScrollAfter, hasScrollBefore};

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      rafId = null;

      applyState(element, isVertical, hasScrollBefore, hasScrollAfter);
      reportState(isVertical, hasScrollBefore, hasScrollAfter);
    });
  }

  function start() {
    const element = toValue(props.containerRef);

    if (!element || !toValue(props.isEnabled) || toValue(props.visibility) !== "auto") {
      return;
    }

    checkOverflow();
    element.addEventListener("scroll", checkOverflow, {passive: true});

    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(element);
    }

    // The container box alone misses content growing inside a fixed-size box, which fires
    // neither resize nor scroll and would leave the shadow attributes stale.
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(checkOverflow);
      mutationObserver.observe(element, {
        attributeFilter: ["class", "style"],
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    }

    teardown = () => {
      element.removeEventListener("scroll", checkOverflow);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      prevState = null;
    };
  }

  function stop() {
    teardown?.();
    teardown = null;
  }

  onMounted(() => {
    start();

    watch(
      [
        () => toValue(props.visibility),
        () => toValue(props.isEnabled),
        () => toValue(props.orientation),
        () => toValue(props.offset),
        () => toValue(props.containerRef),
      ],
      () => {
        stop();
        start();
      },
      {flush: "post"},
    );
  });

  onBeforeUnmount(stop);
}
