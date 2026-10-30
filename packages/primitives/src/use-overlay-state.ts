import type {MaybeRefOrGetter, Ref} from "vue";

import {nextTick, onScopeDispose, ref, toValue, watch} from "vue";

export interface UseOverlayStateProps {
  isOpen?: MaybeRefOrGetter<boolean | undefined>;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onExitComplete?: () => void;
  shouldSkipAnimation?: MaybeRefOrGetter<boolean | undefined>;
}

export interface UseOverlayStateReturn {
  isOpen: Ref<boolean>;
  isMounted: Ref<boolean>;
  isEntering: Ref<boolean>;
  isExiting: Ref<boolean>;
  contentRef: Ref<HTMLElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
}

type FrameHandle = number | ReturnType<typeof setTimeout>;

const scheduleFrame = (callback: () => void): FrameHandle => {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame(callback);
  }

  return setTimeout(callback, 16);
};

const cancelFrame = (handle: FrameHandle) => {
  if (typeof cancelAnimationFrame === "function" && typeof handle === "number") {
    cancelAnimationFrame(handle);
    return;
  }

  clearTimeout(handle as ReturnType<typeof setTimeout>);
};

const animationDuration = (animation: Animation) => {
  const timing = animation.effect?.getTiming();
  const duration = typeof timing?.duration === "number" ? timing.duration : 0;
  const delay = typeof timing?.delay === "number" ? timing.delay : 0;

  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }

  return duration + Math.max(0, delay);
};

const animationTarget = (animation: Animation): Element | null => {
  const effect = animation.effect as KeyframeEffect | null;

  return effect?.target ?? null;
};

const getSubtreeAnimations = (element: Element): Animation[] => {
  if (typeof element.getAnimations !== "function") {
    return [];
  }

  return element.getAnimations({subtree: true});
};

/**
 * Owns mount/unmount, entering/exiting flags, and the exit hold that keeps the
 * overlay in the DOM until the real CSS animation finishes.
 *
 * Reka's Presence/v-show would hide or unmount immediately on close. Consumers
 * therefore bind Reka's controlled `open` to `isMounted`, not `isOpen`.
 */
export function useOverlayState(props: UseOverlayStateProps = {}): UseOverlayStateReturn {
  const initialOpen = Boolean(toValue(props.isOpen) ?? props.defaultOpen ?? false);

  const isOpen = ref(initialOpen);
  const isMounted = ref(initialOpen);
  const isEntering = ref(false);
  const isExiting = ref(false);
  const contentRef = ref<HTMLElement | null>(null);

  let syncingFromProp = false;
  let finishing = false;
  let exitToken = 0;
  let exitFrame: FrameHandle | null = null;
  let enterTimer: ReturnType<typeof setTimeout> | null = null;
  let exitTimer: ReturnType<typeof setTimeout> | null = null;
  let cleanExitListeners: (() => void) | null = null;
  const pinnedOpacity = new Map<HTMLElement, string>();

  const clearEnterTimer = () => {
    if (enterTimer) {
      clearTimeout(enterTimer);
      enterTimer = null;
    }
  };

  const clearExitTimer = () => {
    if (exitTimer) {
      clearTimeout(exitTimer);
      exitTimer = null;
    }
  };

  const clearExitListeners = () => {
    cleanExitListeners?.();
    cleanExitListeners = null;
  };

  const clearExitFrame = () => {
    if (exitFrame) {
      cancelFrame(exitFrame);
      exitFrame = null;
    }
  };

  const restorePinnedOpacity = () => {
    for (const [element, opacity] of pinnedOpacity) {
      element.style.opacity = opacity;
    }

    pinnedOpacity.clear();
  };

  const exitingElements = (root: HTMLElement) => [
    root,
    ...Array.from(root.querySelectorAll<HTMLElement>('[data-exiting="true"]')),
  ];

  const pinOpacity = () => {
    const root = contentRef.value;

    if (!root) {
      return;
    }

    for (const element of exitingElements(root)) {
      if (!pinnedOpacity.has(element)) {
        pinnedOpacity.set(element, element.style.opacity);
      }

      element.style.opacity = "0";
    }
  };

  const finishExit = () => {
    if (finishing || !isExiting.value) {
      return;
    }

    finishing = true;
    clearExitFrame();
    clearExitTimer();
    clearExitListeners();

    // WebKit can restore opacity from fill-mode:none after the animation ends.
    // Pin before unmount, then restore only after the DOM is gone.
    pinOpacity();

    exitFrame = scheduleFrame(() => {
      exitFrame = null;

      if (!isExiting.value) {
        finishing = false;
        return;
      }

      isMounted.value = false;
      isExiting.value = false;
      finishing = false;

      void nextTick(() => {
        restorePinnedOpacity();
        props.onExitComplete?.();
      });
    });
  };

  const collectExitAnimations = (root: HTMLElement) => {
    const targets = exitingElements(root);
    const animations: Animation[] = [];

    for (const animation of getSubtreeAnimations(root)) {
      const target = animationTarget(animation);

      if (!target || !targets.some((element) => element === target || element.contains(target))) {
        continue;
      }

      if (animation.playState === "finished" || animation.playState === "idle") {
        continue;
      }

      if (animationDuration(animation) <= 0) {
        continue;
      }

      animations.push(animation);
    }

    return animations;
  };

  const beginExitHold = (token: number, attempt: number) => {
    if (token !== exitToken || !isExiting.value) {
      return;
    }

    const root = contentRef.value;

    if (!root) {
      finishExit();
      return;
    }

    const animations = collectExitAnimations(root);
    const pending = animations.filter((animation) => (animation.playState as string) === "pending");

    if (pending.length > 0 && attempt < 10) {
      exitFrame = scheduleFrame(() => {
        exitFrame = null;
        beginExitHold(token, attempt + 1);
      });
      return;
    }

    if (animations.length === 0) {
      finishExit();
      return;
    }

    const duration = animations.reduce(
      (longest, animation) => Math.max(longest, animationDuration(animation)),
      0,
    );

    const handleAnimationEnd = (event: Event) => {
      if (token !== exitToken) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const relevant = exitingElements(root).some(
        (element) => element === target || element.contains(target),
      );

      if (!relevant) {
        return;
      }

      if (animations.every((animation) => animation.playState === "finished")) {
        finishExit();
      }
    };

    root.addEventListener("animationend", handleAnimationEnd, true);
    root.addEventListener("animationcancel", handleAnimationEnd, true);
    cleanExitListeners = () => {
      root.removeEventListener("animationend", handleAnimationEnd, true);
      root.removeEventListener("animationcancel", handleAnimationEnd, true);
    };

    void Promise.allSettled(
      animations.map((animation) => animation.finished.catch(() => undefined)),
    ).then(() => {
      if (token === exitToken) {
        finishExit();
      }
    });

    exitTimer = setTimeout(finishExit, duration + 80);
  };

  const startExit = () => {
    const token = ++exitToken;
    finishing = false;
    clearExitFrame();

    if (toValue(props.shouldSkipAnimation)) {
      exitFrame = scheduleFrame(() => {
        exitFrame = null;
        finishExit();
      });
      return;
    }

    void nextTick(() => {
      if (token !== exitToken || !isExiting.value) {
        return;
      }

      // One frame lets data-exiting and the CSS animation start before measuring.
      exitFrame = scheduleFrame(() => {
        exitFrame = null;
        beginExitHold(token, 0);
      });
    });
  };

  const scheduleEnteringEnd = () => {
    void nextTick(() => {
      if (!isOpen.value || !isEntering.value) {
        return;
      }

      exitFrame = scheduleFrame(() => {
        exitFrame = null;

        if (!isOpen.value || !isEntering.value) {
          return;
        }

        const root = contentRef.value;

        if (!root) {
          isEntering.value = false;
          return;
        }

        const animations = collectExitAnimations(root);
        const duration = animations.reduce(
          (longest, animation) => Math.max(longest, animationDuration(animation)),
          0,
        );

        if (duration <= 0) {
          isEntering.value = false;
          return;
        }

        enterTimer = setTimeout(() => {
          enterTimer = null;
          isEntering.value = false;
        }, duration + 80);
      });
    });
  };

  const open = () => {
    if (isOpen.value) {
      return;
    }

    exitToken += 1;
    finishing = false;
    clearEnterTimer();
    clearExitFrame();
    clearExitTimer();
    clearExitListeners();
    restorePinnedOpacity();

    isOpen.value = true;
    isMounted.value = true;
    isExiting.value = false;
    isEntering.value = !toValue(props.shouldSkipAnimation);

    if (!syncingFromProp) {
      props.onOpenChange?.(true);
    }

    if (isEntering.value) {
      scheduleEnteringEnd();
    }
  };

  const close = () => {
    if (!isOpen.value || isExiting.value) {
      return;
    }

    clearEnterTimer();
    isOpen.value = false;
    isEntering.value = false;
    isExiting.value = true;

    if (!syncingFromProp) {
      props.onOpenChange?.(false);
    }

    startExit();
  };

  const setOpen = (next: boolean) => {
    if (next) {
      open();
    } else {
      close();
    }
  };

  const toggle = () => {
    setOpen(!isOpen.value);
  };

  watch(
    () => toValue(props.isOpen),
    (next) => {
      if (next === undefined || next === isOpen.value) {
        return;
      }

      syncingFromProp = true;

      try {
        if (next) {
          open();
        } else {
          close();
        }
      } finally {
        syncingFromProp = false;
      }
    },
  );

  onScopeDispose(() => {
    exitToken += 1;
    clearEnterTimer();
    clearExitTimer();
    clearExitListeners();
    clearExitFrame();
    restorePinnedOpacity();
  });

  return {
    isOpen,
    isMounted,
    isEntering,
    isExiting,
    contentRef,
    open,
    close,
    toggle,
    setOpen,
  };
}
