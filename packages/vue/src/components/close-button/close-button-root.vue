<script setup lang="ts">
import {useFocusRing, useHover, usePress} from "@sail-ui/primitives";
import {closeButtonVariants, cx} from "@sail-ui/styles";
import {computed, ref, useAttrs, useSlots, type Slots} from "vue";

import {CloseIcon} from "../../shared/icons";
import {hasSlotContent} from "../../shared/vnode";
import type {CloseButtonRootProps} from "./types";

defineOptions({name: "SailCloseButton", inheritAttrs: false});

const props = withDefaults(defineProps<CloseButtonRootProps>(), {
  isDisabled: false,
  isPending: false,
  type: "button",
  variant: "default"
});

const attrs = useAttrs();
const componentSlots = useSlots() as Slots;
const buttonRef = ref<HTMLButtonElement | null>(null);
const isDisabled = computed(() => props.isDisabled);
const isInteractiveDisabled = computed(() => props.isDisabled || props.isPending);
const classes = computed(() =>
  cx(closeButtonVariants({variant: props.variant}), attrs.class as string | undefined)
);
const ariaLabel = computed(() => {
  const label = attrs["aria-label"] as string | undefined;

  if (label !== undefined) {
    return label;
  }

  return attrs["aria-labelledby"] !== undefined ? undefined : "Close";
});
const type = computed(() => (props.type === "submit" && props.isPending ? "button" : props.type));
const hasCustomContent = computed(() => hasSlotContent(componentSlots.default));

const {isHovered} = useHover(buttonRef, {isDisabled: isInteractiveDisabled});
const {isPressed} = usePress(buttonRef, {isDisabled: isInteractiveDisabled});
const {isFocused, isFocusVisible} = useFocusRing(buttonRef, {isDisabled: isInteractiveDisabled});
</script>

<template>
  <button
    ref="buttonRef"
    v-bind="$attrs"
    :aria-disabled="isPending ? 'true' : undefined"
    :aria-label="ariaLabel"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focused="isFocused ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-pending="isPending ? 'true' : undefined"
    :data-pressed="isPressed ? 'true' : undefined"
    :data-slot="'close-button'"
    :disabled="isDisabled || undefined"
    :type="type"
  >
    <slot v-if="hasCustomContent" />
    <CloseIcon
      v-else
      data-slot="close-button-icon"
    />
  </button>
</template>
