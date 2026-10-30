import type {DrawerPlacement} from "./context";

import type {ComputedRef, MaybeRefOrGetter, Ref} from "vue";
import {computed, ref, toValue} from "vue";

import {resolveElement} from "../../shared/element";

const DRAG_THRESHOLD = 8;
const DISMISS_FRACTION = 0.3;
const VELOCITY_THRESHOLD = 0.5;

const SNAP_BACK_TRANSITION = "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)";

export type DrawerDragHandlers = Record<string, (event: PointerEvent) => void>;

export interface UseDrawerDragOptions {
  placement: MaybeRefOrGetter<DrawerPlacement>;
  isDismissable: MaybeRefOrGetter<boolean>;
  onDismiss: () => void;
}

export interface UseDrawerDragReturn {
  dialogRef: Ref<HTMLElement | null>;
  setDialogRef: (element: unknown) => void;
  dragHandlers: ComputedRef<DrawerDragHandlers>;
}

function isInteractiveTarget(target: HTMLElement) {
  return Boolean(
    target.closest(
      "input, textarea, button, [role='button'], select, a, [data-slot='drawer-body']",
    ),
  );
}

/**
 * Ports the upstream drawer drag-to-dismiss gesture: an 8px activation
 * threshold, dismissal past 30% of the panel or a 0.5px/ms flick, and a
 * spring-like snap back when the gesture is released early.
 */
export function useDrawerDrag(options: UseDrawerDragOptions): UseDrawerDragReturn {
  const dialogRef = ref<HTMLElement | null>(null);

  let isDragging = false;
  let isActive = false;
  let activePointerId: number | null = null;
  let startPos = 0;
  let currentOffset = 0;
  let velocity = 0;
  let lastTime = 0;
  let lastPos = 0;

  const isVertical = () => {
    const placement = toValue(options.placement);

    return placement === "top" || placement === "bottom";
  };

  const getPos = (event: PointerEvent) => (isVertical() ? event.clientY : event.clientX);

  const clamp = (delta: number) => {
    switch (toValue(options.placement)) {
      case "bottom":
        return Math.max(0, delta);
      case "top":
        return Math.min(0, delta);
      case "right":
        return Math.max(0, delta);
      case "left":
        return Math.min(0, delta);
      default:
        return delta;
    }
  };

  const releasePointer = (dialog: HTMLElement) => {
    if (activePointerId === null) {
      return;
    }

    try {
      dialog.releasePointerCapture(activePointerId);
    } catch {
      // Cancellation or lost capture may have already released the pointer.
    }

    activePointerId = null;
  };

  const snapBack = (dialog: HTMLElement) => {
    dialog.style.transition = SNAP_BACK_TRANSITION;
    dialog.style.transform = "";

    dialog.addEventListener(
      "transitionend",
      () => {
        dialog.style.transition = "";
      },
      {once: true},
    );
  };

  const reset = () => {
    isDragging = false;
    isActive = false;
    currentOffset = 0;
    velocity = 0;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!toValue(options.isDismissable) || event.button !== 0) {
      return;
    }

    const dialog = dialogRef.value;
    const target = event.target as HTMLElement | null;

    if (!dialog || !target) {
      return;
    }

    if (target.closest('[data-slot="drawer-dialog"]') !== dialog) {
      return;
    }

    if (isInteractiveTarget(target)) {
      return;
    }

    isDragging = true;
    isActive = false;
    startPos = getPos(event);
    lastPos = startPos;
    lastTime = Date.now();
    currentOffset = 0;
    velocity = 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    const dialog = dialogRef.value;

    if (!isDragging || !dialog) {
      return;
    }

    const pos = getPos(event);
    const rawDelta = pos - startPos;
    const delta = clamp(rawDelta);

    if (!isActive) {
      if (Math.abs(rawDelta) < DRAG_THRESHOLD) {
        return;
      }

      isActive = true;
      activePointerId = event.pointerId;
      dialog.style.transition = "none";

      try {
        dialog.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is an optimization, not a requirement.
      }
    }

    currentOffset = delta;

    const now = Date.now();
    const elapsed = now - lastTime;

    if (elapsed > 0) {
      velocity = (pos - lastPos) / elapsed;
      lastTime = now;
      lastPos = pos;
    }

    dialog.style.transform = `translate${isVertical() ? "Y" : "X"}(${delta}px)`;
  };

  const onPointerUp = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    const dialog = dialogRef.value;

    if (!dialog || !isActive) {
      reset();
      return;
    }

    isActive = false;
    releasePointer(dialog);

    const dimension = isVertical() ? dialog.offsetHeight : dialog.offsetWidth;
    const shouldDismiss =
      Math.abs(currentOffset) > dimension * DISMISS_FRACTION ||
      Math.abs(velocity) > VELOCITY_THRESHOLD;

    if (shouldDismiss) {
      // Drop the inline `transition: none` so the exit translate can run, but
      // keep the drag transform so the panel keeps sliding from that offset.
      dialog.style.transition = "";
      options.onDismiss();
    } else {
      snapBack(dialog);
    }

    currentOffset = 0;
    velocity = 0;
  };

  const onPointerCancel = () => {
    if (!isDragging) {
      return;
    }

    const wasActive = isActive;
    const dialog = dialogRef.value;

    reset();

    if (!dialog) {
      return;
    }

    releasePointer(dialog);

    if (wasActive) {
      snapBack(dialog);
    }
  };

  const onLostPointerCapture = (event: PointerEvent) => {
    // setPointerCapture moves capture off the hit child, and that child fires
    // lostpointercapture first. Only the dialog losing its own capture aborts.
    if (event.target !== event.currentTarget) {
      return;
    }

    onPointerCancel();
  };

  return {
    dialogRef,
    setDialogRef: (element) => {
      dialogRef.value = resolveElement(element);
    },
    // The handlers fall through Reka's dialog components onto a DOM element,
    // so the keys must match Vue's native event naming (onPointerdown, ...).
    dragHandlers: computed<DrawerDragHandlers>(() =>
      toValue(options.isDismissable)
        ? {
            onLostpointercapture: onLostPointerCapture,
            onPointercancel: onPointerCancel,
            onPointerdown: onPointerDown,
            onPointermove: onPointerMove,
            onPointerup: onPointerUp,
          }
        : ({} as DrawerDragHandlers),
    ),
  };
}
