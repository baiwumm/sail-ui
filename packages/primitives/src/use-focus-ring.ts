import type {MaybeRefOrGetter, Ref} from "vue";

import {onBeforeUnmount, onMounted, ref, toValue, watch} from "vue";

export interface UseFocusRingOptions {
  isDisabled?: MaybeRefOrGetter<boolean | undefined>;
  /**
   * Reports focus of any descendant of the target instead of the target
   * itself. Used by group elements that are not focusable on their own.
   */
  within?: MaybeRefOrGetter<boolean | undefined>;
}

export interface UseFocusRingReturn {
  isFocused: Ref<boolean>;
  isFocusVisible: Ref<boolean>;
}

const keyboardDocuments = new WeakSet<Document>();
let lastInputWasKeyboard = false;

function trackModality(document: Document) {
  if (keyboardDocuments.has(document)) {
    return;
  }

  keyboardDocuments.add(document);
  document.addEventListener(
    "keydown",
    () => {
      lastInputWasKeyboard = true;
    },
    true,
  );
  document.addEventListener(
    "pointerdown",
    () => {
      lastInputWasKeyboard = false;
    },
    true,
  );
  document.addEventListener(
    "mousedown",
    () => {
      lastInputWasKeyboard = false;
    },
    true,
  );
  document.addEventListener(
    "touchstart",
    () => {
      lastInputWasKeyboard = false;
    },
    true,
  );
}

function matchesFocusVisible(element: Element) {
  try {
    return element.matches(":focus-visible");
  } catch {
    return false;
  }
}

/**
 * Applies the same keyboard-modality rule as `useFocusRing` to an event
 * target. Used by components that cannot hold a ref on the element they
 * render through a slot merge.
 */
export function isKeyboardFocusVisible(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  if (typeof document !== "undefined") {
    trackModality(document);
  }

  return matchesFocusVisible(target) && lastInputWasKeyboard;
}

/**
 * Reka does not emit `data-focus-visible`. Browser `:focus-visible` is not
 * enough on its own: Chromium reports it for programmatic focus inside popups
 * opened with a pointer. The attribute therefore requires keyboard modality.
 */
export function useFocusRing(
  target: MaybeRefOrGetter<Element | null | undefined>,
  options: UseFocusRingOptions = {},
): UseFocusRingReturn {
  const isFocused = ref(false);
  const isFocusVisible = ref(false);
  let element: Element | null = null;
  let boundWithin: boolean | undefined;

  const disabled = () => Boolean(toValue(options.isDisabled));
  const within = () => Boolean(toValue(options.within));

  const handleFocus = () => {
    if (disabled()) {
      return;
    }

    if (element && typeof document !== "undefined") {
      trackModality(document);
    }

    isFocused.value = true;
    isFocusVisible.value = element
      ? matchesFocusVisible(element) && lastInputWasKeyboard
      : lastInputWasKeyboard;
  };

  const handleBlur = () => {
    isFocused.value = false;
    isFocusVisible.value = false;
  };

  const handleFocusIn = (event: Event) => {
    if (disabled()) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element) || !element?.contains(target)) {
      return;
    }

    if (typeof document !== "undefined") {
      trackModality(document);
    }

    isFocused.value = true;
    isFocusVisible.value = matchesFocusVisible(target) && lastInputWasKeyboard;
  };

  const handleFocusOut = (event: Event) => {
    const next = (event as FocusEvent).relatedTarget as Node | null;

    if (element && next && element.contains(next)) {
      return;
    }

    isFocused.value = false;
    isFocusVisible.value = false;
  };

  const unbind = () => {
    element?.removeEventListener("focus", handleFocus);
    element?.removeEventListener("blur", handleBlur);
    element?.removeEventListener("focusin", handleFocusIn);
    element?.removeEventListener("focusout", handleFocusOut);
    element = null;
    boundWithin = undefined;
  };

  const bind = () => {
    const next = toValue(target) as Element | null | undefined;
    const mode = within();

    if (next === element && mode === boundWithin) {
      return;
    }

    unbind();

    if (!next) {
      return;
    }

    element = next;
    boundWithin = mode;

    if (mode) {
      element.addEventListener("focusin", handleFocusIn);
      element.addEventListener("focusout", handleFocusOut);
    } else {
      element.addEventListener("focus", handleFocus);
      element.addEventListener("blur", handleBlur);
    }

    if (typeof document !== "undefined") {
      trackModality(document);
    }
  };

  onMounted(bind);
  watch(() => toValue(target), bind);
  watch(() => within(), bind);
  watch(
    () => disabled(),
    (value) => {
      if (value) {
        isFocusVisible.value = false;
      }
    },
  );
  onBeforeUnmount(unbind);

  return {isFocused, isFocusVisible};
}
