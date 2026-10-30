<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {computed, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSheetContext} from "./context";
import type {SheetCloseProps} from "./types";

defineOptions({name: "SailSheetClose", inheritAttrs: false});

const props = withDefaults(defineProps<SheetCloseProps>(), {
  isDisabled: false,
  type: "button",
});

const {forwarded, className} = useForwardedAttrs();
const {close} = useSheetContext();
const buttonRef = ref<HTMLElement | null>(null);
const isDisabled = computed(() => props.isDisabled);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled});

const classes = computed(() => cx(className.value));

function setButtonRef(element: unknown) {
  buttonRef.value = element instanceof HTMLElement ? element : null;
}

function handleClick() {
  if (!isDisabled.value) {
    close();
  }
}
</script>

<template>
  <button
    :ref="setButtonRef"
    v-bind="forwarded"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :disabled="isDisabled || undefined"
    :type="type"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
