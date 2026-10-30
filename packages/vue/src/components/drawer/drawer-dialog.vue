<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {DialogContent} from "reka-ui";
import type {StyleValue} from "vue";
import {computed, useAttrs} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDrawerContext} from "./context";
import {useDrawerDrag} from "./use-drawer-drag";

defineOptions({name: "SailDrawerDialog", inheritAttrs: false});

const attrs = useAttrs();
const {placement, slots, contentId, isDismissable, isKeyboardDismissDisabled, close} =
  useDrawerContext();

const {setDialogRef, dragHandlers} = useDrawerDrag({
  placement,
  isDismissable,
  onDismiss: close,
});

const {forwarded: forwardedAttrs} = useForwardedAttrs();
const forwarded = computed(() => {
  const rest = {...forwardedAttrs.value};

  delete rest.style;

  return rest;
});
const dialogAttrs = computed(() => ({...dragHandlers.value, ...forwarded.value}));
const classes = computed(() => cx(slots.value.dialog(), attrs.class as string | undefined));
const dialogStyle = computed<StyleValue>(() => {
  const style = attrs.style as StyleValue;

  return isDismissable.value ? [{touchAction: "none"}, style] : style;
});

function handlePointerDownOutside(event: Event) {
  if (!isDismissable.value) {
    event.preventDefault();
  }
}

function handleEscapeKeyDown(event: KeyboardEvent) {
  if (isKeyboardDismissDisabled.value) {
    event.preventDefault();
  }
}
</script>

<template>
  <!-- Upstream Drawer has no description part, so Reka's generated
       aria-describedby would point at a missing element. Forward only a
       consumer-provided value. -->
  <DialogContent
    :id="contentId"
    :ref="setDialogRef"
    v-bind="dialogAttrs"
    :aria-describedby="attrs['aria-describedby']"
    aria-modal="true"
    :class="classes"
    :data-placement="placement"
    :data-slot="'drawer-dialog'"
    :style="dialogStyle"
    @escape-key-down="handleEscapeKeyDown"
    @pointer-down-outside="handlePointerDownOutside"
  >
    <slot />
  </DialogContent>
</template>
