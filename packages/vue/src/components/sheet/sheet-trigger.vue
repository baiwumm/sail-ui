<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, onScopeDispose, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";
import type {SheetTriggerProps} from "./types";

defineOptions({name: "SailSheetTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<SheetTriggerProps>(), {
  isDisabled: false,
  type: "button",
});

const {forwarded, className} = useForwardedAttrs();
const {triggerRef, contentId, isOpen, open, close, isTriggerDisabled} = useSheetContext();
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isFocusVisible} = useFocusRing(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {isDisabled});

const classes = computed(() => cx(className.value));

watch(
  isDisabled,
  (value) => {
    isTriggerDisabled.value = value;
  },
  {immediate: true},
);

onScopeDispose(() => {
  isTriggerDisabled.value = false;
});

function setTriggerRef(element: unknown) {
  triggerRef.value = element instanceof HTMLElement ? element : null;
}

function toggle() {
  if (isDisabled.value) {
    return;
  }

  if (isOpen.value) {
    close();
  } else {
    open();
  }
}
</script>

<template>
  <button
    :ref="setTriggerRef"
    v-bind="forwarded"
    aria-haspopup="dialog"
    :aria-controls="isOpen ? contentId : undefined"
    :aria-expanded="isOpen"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :disabled="isDisabled || undefined"
    :type="type"
    @click="toggle"
  >
    <slot />
  </button>
</template>
