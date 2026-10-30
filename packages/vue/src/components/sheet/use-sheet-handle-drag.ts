import type {ComputedRef, Ref} from "vue";
import {onScopeDispose, ref} from "vue";

import type {SheetPlacement} from "./context";

const DISMISS_FRACTION = 0.25;
const VELOCITY_THRESHOLD = 0.4;
const SNAP_BACK_TRANSITION = "transform 500ms cubic-bezier(0.32, 0.72, 0, 1)";

export interface UseSheetHandleDragOptions {
  placement: ComputedRef<SheetPlacement>;
  isDismissable: Ref<boolean>;
  dialogRef: Ref<HTMLElement | null>;
  onDismiss: () => void;
}

type PointerHandler = (event: PointerEvent) => void;

function isInteractiveTarget(target: HTMLElement) {
  return Boolean(target.closest("input, textarea, button, [role='button'], select, a"));
}

/**
 * Ports the upstream handle drag: a 25% travel or 0.4px/ms flick dismisses the
 * sheet, otherwise it settles back with the same release curve as the panel.
 */
export function useSheetHandleDrag(options: UseSheetHandleDragOptions) {
  const isDragging = ref(false);

  let activePointerId: number | null = null;
  let handle: HTMLElement | null = null;
  let startPos = 0;
  let currentOffset = 0;
  let velocity = 0;
  let lastTime = 0;
  let lastPos = 0;

  const isVertical = () =>
    options.placement.value === "top" || options.placement.value === "bottom";

  const getPos = (event: PointerEvent) => (isVertical() ? event.clientY : event.clientX);

  const clamp = (delta: number) => {
    switch (options.placement.value) {
      case "bottom":
      case "right":
        return Math.max(0, delta);
      case "top":
      case "left":
        return Math.min(0, delta);
      default:
        return delta;
    }
  };

  const releasePointer = () => {
    if (activePointerId === null || !handle) {
      return;
    }

    try {
      handle.releasePointerCapture(activePointerId);
    } catch {
      // Cancellation or lost capture may have already released the pointer.
    }

    activePointerId = null;
  };

  const stopDragging = () => {
    releasePointer();
    handle = null;
    isDragging.value = false;
    currentOffset = 0;
    velocity = 0;
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

  const onPointerDown: PointerHandler = (event) => {
    if (!options.isDismissable.value || event.button !== 0 || isDragging.value) {
      return;
    }

    const dialog = options.dialogRef.value;
    const target = event.currentTarget as HTMLElement | null;

    if (!dialog || !target || isInteractiveTarget(target)) {
      return;
    }

    // A drag that starts mid-entry must own the transform outright.
    if (typeof dialog.getAnimations === "function") {
      for (const animation of dialog.getAnimations()) {
        animation.cancel();
      }
    }

    handle = target;
    startPos = getPos(event);
    lastPos = startPos;
    lastTime = Date.now();
    currentOffset = 0;
    velocity = 0;
    isDragging.value = true;
    activePointerId = event.pointerId;
    dialog.style.transition = "none";

    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is an optimization, not a requirement.
    }
  };

  const onPointerMove: PointerHandler = (event) => {
    const dialog = options.dialogRef.value;

    if (!isDragging.value || !dialog) {
      return;
    }

    const pos = getPos(event);
    const delta = clamp(pos - startPos);

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

  const finish = (cancelled: boolean) => {
    if (!isDragging.value) {
      return;
    }

    const dialog = options.dialogRef.value;
    const offset = currentOffset;
    const releaseVelocity = velocity;

    stopDragging();

    if (!dialog || cancelled) {
      if (dialog) {
        snapBack(dialog);
      }

      return;
    }

    const dimension = isVertical() ? dialog.offsetHeight : dialog.offsetWidth;
    const shouldDismiss =
      Math.abs(offset) > dimension * DISMISS_FRACTION ||
      Math.abs(releaseVelocity) > VELOCITY_THRESHOLD;

    if (shouldDismiss) {
      // Drop `transition: none` so the exit slide can run from the drag offset.
      dialog.style.transition = "";
      options.onDismiss();
      return;
    }

    snapBack(dialog);
  };

  const onPointerUp: PointerHandler = () => finish(false);
  const onPointerCancel: PointerHandler = () => finish(true);

  const onLostPointerCapture: PointerHandler = (event) => {
    // Only the handle losing its own capture aborts the gesture.
    if (event.target !== event.currentTarget) {
      return;
    }

    finish(true);
  };

  onScopeDispose(() => {
    stopDragging();
  });

  return {
    handlers: {
      onLostpointercapture: onLostPointerCapture,
      onPointercancel: onPointerCancel,
      onPointerdown: onPointerDown,
      onPointermove: onPointerMove,
      onPointerup: onPointerUp,
    },
    isDragging,
  };
}
