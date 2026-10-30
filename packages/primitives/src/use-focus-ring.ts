import type {MaybeRefOrGetter, Ref} from "vue";

import {onBeforeUnmount, onMounted, ref, toValue, watch} from "vue";

export interface UseFocusRingOptions {
  isDisabled?: MaybeRefOrGetter<boolean | undefined>;
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

  const disabled = () => Boolean(toValue(options.isDisabled));

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

  const unbind = () => {
    element?.removeEventListener("focus", handleFocus);
    element?.removeEventListener("blur", handleBlur);
    element = null;
  };

  const bind = () => {
    const next = toValue(target) as Element | null | undefined;

    if (next === element) {
      return;
    }

    unbind();

    if (!next) {
      return;
    }

    element = next;
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);

    if (typeof document !== "undefined") {
      trackModality(document);
    }
  };

  onMounted(bind);
  watch(() => toValue(target), bind);
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
