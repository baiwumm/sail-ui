<script setup lang="ts">
import {cx, sheetVariants} from "@sail-ui/styles";
import {DialogOverlay, DialogPortal} from "reka-ui";
import type {CSSProperties, StyleValue} from "vue";
import {computed, provide, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useViewportVars} from "../../shared/viewport-vars";
import {sheetContextKey, useSheetContext} from "./context";
import type {SheetBackdropProps} from "./types";
import {useSheetBackdropMotion} from "./use-sheet-motion";

defineOptions({name: "SailSheetBackdrop", inheritAttrs: false});

const props = withDefaults(defineProps<SheetBackdropProps>(), {
  isDismissable: true,
  isKeyboardDismissDisabled: false,
});

const {className, forwarded} = useForwardedAttrs();
const context = useSheetContext();

const mergedSlots = computed(() => ({
  ...context.slots.value,
  ...sheetVariants({backdrop: props.variant, placement: context.placement.value}),
}));
const isDismissable = computed(() => props.isDismissable);
const isKeyboardDismissDisabled = computed(() => props.isKeyboardDismissDisabled);

provide(sheetContextKey, {
  ...context,
  isDismissable,
  isKeyboardDismissDisabled,
  slots: mergedSlots,
});

const overlayClasses = computed(() => cx(mergedSlots.value.overlay(), className.value));
const backdropClasses = computed(() => mergedSlots.value.backdrop());
const viewportVars = useViewportVars();

// The upstream overlay layout comes from React Aria's inline styles; the Sheet
// CSS only sizes and rounds the surface, so Sail supplies the fixed layer here.
const overlayStyle = computed<StyleValue>(() => {
  const alignment: CSSProperties = {};

  switch (context.placement.value) {
    case "top":
      Object.assign(alignment, {alignItems: "flex-start", justifyContent: "center"});
      break;
    case "left":
      Object.assign(alignment, {alignItems: "stretch", justifyContent: "flex-start"});
      break;
    case "right":
      Object.assign(alignment, {alignItems: "stretch", justifyContent: "flex-end"});
      break;
    default:
      Object.assign(alignment, {alignItems: "flex-end", justifyContent: "center"});
  }

  return [
    {
      position: "fixed",
      inset: 0,
      zIndex: "var(--z-index-overlay)",
      display: "flex",
    },
    alignment,
    viewportVars.value,
  ];
});

const overlayRef = ref<HTMLElement | null>(null);
const backdropRef = ref<HTMLElement | null>(null);

useSheetBackdropMotion(backdropRef, context.isEntering, context.isExiting);

// While the overlay is closed but still mounted (the exit hold) the surface
// stays visible for the animation; hide it from assistive technology.
const isOverlayHidden = computed(() => !context.isOpen.value);

// Function refs also run on unmount, so a closed overlay never keeps a stale element.
function setOverlayRef(element: unknown) {
  overlayRef.value = element instanceof HTMLElement ? element : null;
  context.contentRef.value = overlayRef.value;
}
</script>

<template>
  <DialogPortal v-if="context.isMounted.value">
    <DialogOverlay as-child>
      <div
        :ref="setOverlayRef"
        v-bind="forwarded"
        :aria-hidden="isOverlayHidden ? 'true' : undefined"
        :class="overlayClasses"
        :data-closed="context.isOpen.value ? undefined : ''"
        :data-entering="context.isEntering.value ? 'true' : undefined"
        :data-exiting="context.isExiting.value ? 'true' : undefined"
        :data-slot="'sheet-overlay'"
        :inert="isOverlayHidden || undefined"
        :style="overlayStyle"
      >
        <div
          ref="backdropRef"
          :class="backdropClasses"
          :data-slot="'sheet-backdrop'"
          :data-stack-index="'0'"
          :style="{position: 'absolute', inset: 0}"
        />
        <slot />
      </div>
    </DialogOverlay>
  </DialogPortal>
</template>
