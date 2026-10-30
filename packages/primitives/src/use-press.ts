import type {MaybeRefOrGetter, Ref} from "vue";

import {onBeforeUnmount, onMounted, ref, toValue, watch} from "vue";

/**
 * Submit and reset buttons keep their native Space activation so the browser
 * still fires `click` and submits or resets the owning form.
 */
function keepsNativeActivation(element: Element | null) {
  if (!element || !(element instanceof HTMLButtonElement)) {
    return false;
  }

  return element.type === "submit" || element.type === "reset";
}

/**
 * Form controls keep their native keyboard activation. Preventing the default
 * Space action would stop a checkbox from toggling or a radio from selecting.
 */
function isWithinFormControl(target: EventTarget | null) {
  const element = target as HTMLElement | null;

  if (!element || typeof element.closest !== "function") {
    return false;
  }

  return Boolean(element.closest("input, textarea, select, button"));
}

export interface PressEvent {
  pointerType: string;
  originalEvent: Event;
  x?: number;
  y?: number;
}

export interface UsePressOptions {
  isDisabled?: MaybeRefOrGetter<boolean | undefined>;
  onPress?: (event: PressEvent) => void;
}

export interface UsePressReturn {
  isPressed: Ref<boolean>;
}

/**
 * Mirrors React Aria's press lifecycle closely enough for the CSS contract:
 * pointer press ends on pointerup, Space activates on keyup, Enter on keydown.
 */
export function usePress(
  target: MaybeRefOrGetter<Element | null | undefined>,
  options: UsePressOptions = {},
): UsePressReturn {
  const isPressed = ref(false);
  let element: Element | null = null;
  let activePointerId: number | null = null;
  let pressedWithKeyboard = false;

  const disabled = () => Boolean(toValue(options.isDisabled));

  const emitPress = (originalEvent: Event, pointerType: string, x?: number, y?: number) => {
    if (disabled()) {
      return;
    }

    options.onPress?.({originalEvent, pointerType, x, y});
  };

  const reset = () => {
    isPressed.value = false;
    activePointerId = null;
    pressedWithKeyboard = false;
  };

  const handlePointerDown = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (disabled() || pointerEvent.button !== 0) {
      return;
    }

    isPressed.value = true;
    activePointerId = pointerEvent.pointerId;
  };

  const handlePointerUp = (event: Event) => {
    const pointerEvent = event as PointerEvent;

    if (!isPressed.value || activePointerId !== pointerEvent.pointerId) {
      return;
    }

    isPressed.value = false;
    activePointerId = null;
    emitPress(pointerEvent, pointerEvent.pointerType, pointerEvent.clientX, pointerEvent.clientY);
  };

  const handlePointerCancel = () => {
    reset();
  };

  const handleKeyDown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;

    if (disabled() || keyboardEvent.repeat) {
      return;
    }

    if (keyboardEvent.key === " " || keyboardEvent.key === "Spacebar") {
      // Submit and reset buttons keep the native Space activation so the form
      // still submits. React Aria makes the same exception.
      if (!keepsNativeActivation(element) && !isWithinFormControl(keyboardEvent.target)) {
        keyboardEvent.preventDefault();
      }

      isPressed.value = true;
      pressedWithKeyboard = true;
      return;
    }

    if (keyboardEvent.key === "Enter") {
      isPressed.value = true;
      pressedWithKeyboard = true;
      emitPress(keyboardEvent, "keyboard");
    }
  };

  const handleKeyUp = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;

    if (!pressedWithKeyboard) {
      return;
    }

    if (keyboardEvent.key === " " || keyboardEvent.key === "Spacebar") {
      if (!keepsNativeActivation(element) && !isWithinFormControl(keyboardEvent.target)) {
        keyboardEvent.preventDefault();
      }

      isPressed.value = false;
      pressedWithKeyboard = false;
      emitPress(keyboardEvent, "keyboard");
      return;
    }

    if (keyboardEvent.key === "Enter") {
      isPressed.value = false;
      pressedWithKeyboard = false;
    }
  };

  const unbind = () => {
    element?.removeEventListener("pointerdown", handlePointerDown);
    element?.removeEventListener("pointerup", handlePointerUp);
    element?.removeEventListener("pointercancel", handlePointerCancel);
    element?.removeEventListener("pointerleave", handlePointerCancel);
    element?.removeEventListener("keydown", handleKeyDown);
    element?.removeEventListener("keyup", handleKeyUp);
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
    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);
    element.addEventListener("pointerleave", handlePointerCancel);
    element.addEventListener("keydown", handleKeyDown);
    element.addEventListener("keyup", handleKeyUp);
  };

  onMounted(bind);
  watch(() => toValue(target), bind);
  watch(
    () => disabled(),
    (value) => {
      if (value) {
        reset();
      }
    },
  );
  onBeforeUnmount(unbind);

  return {isPressed};
}
