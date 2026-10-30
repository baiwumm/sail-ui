<script setup lang="ts">
import {cx} from "@sail-ui/styles";
import {computed, useAttrs} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";
import {useSheetHandleDrag} from "./use-sheet-handle-drag";

defineOptions({name: "SailSheetHandle", inheritAttrs: false});

const attrs = useAttrs();
const {forwarded} = useForwardedAttrs();
const {slots, placement, dialogRef, isDismissable, close} = useSheetContext();

const {handlers, isDragging} = useSheetHandleDrag({
  placement,
  isDismissable,
  dialogRef,
  onDismiss: close,
});

const classes = computed(() => cx(slots.value.handle(), attrs.class as string | undefined));
const handleAttrs = computed(() => ({...forwarded.value, ...handlers}));
const handleBarClasses = computed(() => slots.value.handleBar());
</script>

<template>
  <div
    v-bind="handleAttrs"
    aria-hidden="true"
    :class="classes"
    :data-dragging="isDragging ? '' : undefined"
    data-sheet-handle=""
    :data-slot="'sheet-handle'"
  >
    <slot>
      <span :class="handleBarClasses" :data-slot="'sheet-handle-bar'" />
    </slot>
  </div>
</template>
