import type {MaybeRefOrGetter, Ref} from "vue";

import {onBeforeUnmount, onMounted, ref, toValue, watch} from "vue";

export interface UseHoverOptions {
  isDisabled?: MaybeRefOrGetter<boolean | undefined>;
}

export interface UseHoverReturn {
  isHovered: Ref<boolean>;
}

/**
 * Tracks pointer hover when Reka does not emit `data-hovered`.
 * Touch input is ignored so a tap does not leave a sticky hover state.
 */
export function useHover(
  target: MaybeRefOrGetter<Element | null | undefined>,
  options: UseHoverOptions = {},
): UseHoverReturn {
  const isHovered = ref(false);
  let element: Element | null = null;

  const disabled = () => Boolean(toValue(options.isDisabled));

  const handleEnter = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (disabled() || pointerEvent.pointerType === "touch") {
      return;
    }

    isHovered.value = true;
  };

  const handleLeave = () => {
    isHovered.value = false;
  };

  const unbind = () => {
    element?.removeEventListener("pointerenter", handleEnter);
    element?.removeEventListener("pointerleave", handleLeave);
    element?.removeEventListener("pointercancel", handleLeave);
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
    element.addEventListener("pointerenter", handleEnter);
    element.addEventListener("pointerleave", handleLeave);
    element.addEventListener("pointercancel", handleLeave);
  };

  onMounted(bind);
  watch(() => toValue(target), bind);
  watch(
    () => disabled(),
    (value) => {
      if (value) {
        isHovered.value = false;
      }
    },
  );
  onBeforeUnmount(unbind);

  return {isHovered};
}
