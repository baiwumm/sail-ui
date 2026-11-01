<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogContent} from "reka-ui";
import type {CSSProperties, StyleValue} from "vue";
import {computed, ref, useAttrs} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {resolveElement} from "../../shared/element";
import {useSheetContext} from "./context";
import {useSheetPanelMotion} from "./use-sheet-motion";

defineOptions({name: "SailSheetDialog", inheritAttrs: false});

const attrs = useAttrs();
const {
  placement,
  slots,
  contentId,
  dialogRef: contextDialogRef,
  isDismissable,
  isKeyboardDismissDisabled,
  isEntering,
  isExiting,
} = useSheetContext();

const dialogRef = ref<HTMLElement | null>(null);

useSheetPanelMotion(dialogRef, placement, isEntering, isExiting);

const {forwarded: forwardedAttrs} = useForwardedAttrs();
const forwarded = computed(() => {
  const rest = {...forwardedAttrs.value};

  delete rest.style;

  return rest;
});
const classes = computed(() => cx(slots.value.dialog(), attrs.class as string | undefined));

// React Aria stretches the sheet panel to its wrapper inline; mirror that here
// so side placements fill the full height. Content-sized placements (bottom/
// top) resolve to auto because their wrapper height is content-driven.
const baseStyle: CSSProperties = {height: "100%"};

function setDialogRef(element: unknown) {
  dialogRef.value = resolveElement(element);
  contextDialogRef.value = dialogRef.value;
}

function handleEscapeKeyDown(event: KeyboardEvent) {
  if (isKeyboardDismissDisabled.value) {
    event.preventDefault();
  }
}

function handlePointerDownOutside(event: Event) {
  if (!isDismissable.value) {
    event.preventDefault();
  }
}
</script>

<template>
  <!-- Upstream Sheet has no description part, so Reka's generated
       aria-describedby would point at a missing element. -->
  <DialogContent
    :id="contentId"
    :ref="setDialogRef"
    v-bind="forwarded"
    :aria-describedby="attrs['aria-describedby']"
    aria-modal="true"
    :class="classes"
    :data-placement="placement"
    :data-slot="'sheet-dialog'"
    :style="[baseStyle, attrs.style as StyleValue]"
    @escape-key-down="handleEscapeKeyDown"
    @pointer-down-outside="handlePointerDownOutside"
  >
    <slot />
  </DialogContent>
</template>
