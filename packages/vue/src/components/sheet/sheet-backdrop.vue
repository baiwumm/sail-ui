<script setup lang="ts">
import {cx, sheetVariants} from "@sail-ui/styles";
import {DialogOverlay, DialogPortal} from "reka-ui";
import type {CSSProperties, StyleValue} from "vue";
import {computed, provide, ref, useAttrs} from "vue";

import {sheetContextKey, useSheetContext} from "./context";
import type {SheetBackdropProps} from "./types";
import {useSheetBackdropMotion} from "./use-sheet-motion";

defineOptions({name: "SailSheetBackdrop", inheritAttrs: false});

const props = withDefaults(defineProps<SheetBackdropProps>(), {
  isDismissable: true,
  isKeyboardDismissDisabled: false,
});

const attrs = useAttrs();
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

const overlayClasses = computed(() =>
  cx(mergedSlots.value.overlay(), attrs.class as string | undefined),
);
const backdropClasses = computed(() => mergedSlots.value.backdrop());

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
    attrs.style as CSSProperties,
  ];
});

const overlayRef = ref<HTMLElement | null>(null);
const backdropRef = ref<HTMLElement | null>(null);

useSheetBackdropMotion(backdropRef, context.isEntering, context.isExiting);

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
        :class="overlayClasses"
        :data-closed="context.isOpen.value ? undefined : ''"
        :data-entering="context.isEntering.value ? 'true' : undefined"
        :data-exiting="context.isExiting.value ? 'true' : undefined"
        :data-slot="'sheet-overlay'"
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
