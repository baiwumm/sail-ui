<script setup lang="ts">
import {useFocusRing, useHover, usePress, type PressEvent} from "@sail-ui/primitives";
import {buttonVariants, cx, spinnerVariants} from "@sail-ui/styles";
import {Primitive} from "reka-ui";
import {computed, inject, ref, type ComponentPublicInstance} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {buttonGroupContextKey} from "../button-group/types";
import type {ButtonProps} from "./types";

defineOptions({name: "SailButton", inheritAttrs: false});

const props = withDefaults(defineProps<ButtonProps>(), {
  fullWidth: false,
  isIconOnly: false,
  isDisabled: false,
  isLoading: false,
  type: "button",
});

const emit = defineEmits<{
  press: [event: PressEvent];
}>();

const {className, forwarded} = useForwardedAttrs();
const group = inject(buttonGroupContextKey, null);
const buttonRef = ref<ComponentPublicInstance | null>(null);
const element = computed(() => (buttonRef.value?.$el as Element | null | undefined) ?? null);
const size = computed(() => props.size ?? group?.size.value);
const variant = computed(() => props.variant ?? group?.variant.value);
const fullWidth = computed(() => props.fullWidth || Boolean(group?.fullWidth.value));
const isDisabled = computed(
  () => props.isDisabled || Boolean(group?.isDisabled.value) || props.isLoading,
);
const isNativeButton = computed(() => !props.as || props.as === "button");

const {isHovered} = useHover(element, {isDisabled});
const {isPressed} = usePress(element, {
  isDisabled,
  onPress: (event) => emit("press", event),
});
const {isFocused, isFocusVisible} = useFocusRing(element, {isDisabled});

const classes = computed(() =>
  cx(
    buttonVariants({
      fullWidth: fullWidth.value,
      isIconOnly: props.isIconOnly,
      size: size.value,
      variant: variant.value,
    }),
    className.value,
  ),
);

const spinnerClasses = computed(() => spinnerVariants({color: "current", size: "sm"}));
</script>

<template>
  <Primitive
    ref="buttonRef"
    v-bind="forwarded"
    :aria-busy="isLoading || undefined"
    :as="as ?? 'button'"
    :as-child="asChild"
    :class="classes"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pending="isLoading ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'button'"
    :disabled="isDisabled || undefined"
    :type="isNativeButton ? type : undefined"
  >
    <span
      v-if="isLoading"
      aria-label="Loading"
      :class="spinnerClasses"
      data-slot="spinner"
      role="status"
    >
      <svg aria-hidden="true" data-slot="spinner-icon" fill="none" viewBox="0 0 24 24">
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
    <slot :is-loading="isLoading" />
  </Primitive>
</template>
