<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, onScopeDispose, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDrawerContext} from "./context";
import type {DrawerTriggerProps} from "./types";

defineOptions({name: "SailDrawerTrigger", inheritAttrs: false});

const props = withDefaults(defineProps<DrawerTriggerProps>(), {
  isDisabled: false,
  type: "button",
});

const {forwarded, className} = useForwardedAttrs();
const {slots, triggerRef, contentId, isOpen, open, close, isTriggerDisabled} = useDrawerContext();
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(triggerRef, {isDisabled});
const {isFocusVisible} = useFocusRing(triggerRef, {isDisabled});
const {isPressed} = usePress(triggerRef, {isDisabled});

const classes = computed(() => cx(slots.value.trigger(), className.value));

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
    :data-slot="'drawer-trigger'"
    :disabled="isDisabled || undefined"
    :type="type"
    @click="toggle"
  >
    <slot />
  </button>
</template>
