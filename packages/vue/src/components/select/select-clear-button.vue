<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {cx} from "@sail-ui/styles";
import {injectSelectRootContext} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useSelectContext} from "./context";

defineOptions({name: "SailSelectClearButton", inheritAttrs: false});

const {className, forwarded} = useForwardedAttrs();
const context = useSelectContext();
const rootContext = injectSelectRootContext();
const elementRef = ref<HTMLSpanElement | null>(null);

const isEmpty = computed(() => rootContext.isEmptyModelValue.value);
const isDisabled = computed(() => context.isDisabled.value);

const {isHovered} = useHover(elementRef, {isDisabled});
const {isPressed} = usePress(elementRef, {isDisabled});
const {isFocusVisible} = useFocusRing(elementRef, {isDisabled});

const classes = computed(() => cx(context.slots.value.clearButton(), className.value));

let unregister: (() => void) | undefined;

onMounted(() => {
  unregister = context.registerClearButton();
});

onBeforeUnmount(() => unregister?.());

function handlePointerDown(event: PointerEvent) {
  event.stopPropagation();
}

function handleClick(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  if (!isDisabled.value && !isEmpty.value) {
    context.clear();
  }
}
</script>

<template>
  <span
    ref="elementRef"
    v-bind="forwarded"
    aria-hidden="true"
    :class="classes"
    :data-empty="isEmpty ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'select-clear-button'"
    @click="handleClick"
    @pointerdown="handlePointerDown"
  >
    <slot>
      <svg
        aria-hidden="true"
        data-slot="select-clear-button-icon"
        fill="none"
        height="16"
        role="presentation"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          clip-rule="evenodd"
          d="M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </slot>
  </span>
</template>
