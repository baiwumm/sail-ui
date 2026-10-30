<script setup lang="ts">
import {buttonVariants, cx, spinnerVariants} from "@sail-ui/styles";
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {computed, ref, useAttrs} from "vue";

import type {ButtonProps} from "./types";

defineOptions({name: "SailButton", inheritAttrs: false});

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  fullWidth: false,
  isIconOnly: false,
  isDisabled: false,
  isLoading: false,
  type: "button"
});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const attrs = useAttrs();
const buttonRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled || props.isLoading);

const {isHovered} = useHover(buttonRef, {isDisabled});
const {isPressed} = usePress(buttonRef, {
  isDisabled,
  onPress: (event) => emit("press", event)
});
const {isFocusVisible} = useFocusRing(buttonRef, {isDisabled});

const classes = computed(() =>
  cx(
    buttonVariants({
      fullWidth: props.fullWidth,
      isIconOnly: props.isIconOnly,
      size: props.size,
      variant: props.variant
    }),
    attrs.class as string | undefined
  )
);

const spinnerClasses = computed(() => spinnerVariants({color: "current", size: "sm"}));
</script>

<template>
  <button
    ref="buttonRef"
    v-bind="$attrs"
    :aria-busy="isLoading || undefined"
    :class="classes"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pending="isLoading ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'button'"
    :disabled="isDisabled || undefined"
    :type="type"
  >
    <span
      v-if="isLoading"
      aria-label="Loading"
      :class="spinnerClasses"
      data-slot="spinner"
      role="status"
    >
      <svg
        aria-hidden="true"
        data-slot="spinner-icon"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          stroke-dasharray="42 16"
          stroke-linecap="round"
          stroke-width="3"
        />
      </svg>
    </span>
    <slot />
  </button>
</template>
