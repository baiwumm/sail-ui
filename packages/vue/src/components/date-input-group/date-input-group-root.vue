<script setup lang="ts">
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {computed, inject, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {dateInputGroupContextKey, type DateInputGroupRootProps} from "./types";
import {useGroupState} from "./use-group-state";

defineOptions({name: "SailDateInputGroup", inheritAttrs: false});

const props = withDefaults(defineProps<DateInputGroupRootProps>(), {
  fullWidth: false,
  variant: "primary",
});

const {className, forwarded} = useForwardedAttrs();
const context = inject(dateInputGroupContextKey, null);

const groupRef = ref<HTMLElement | null>(null);

const isDisabled = computed(() => context?.isDisabled.value ?? false);
const isInvalid = computed(() => context?.isInvalid.value ?? false);
const isReadOnly = computed(() => context?.isReadOnly.value ?? false);
const describedBy = computed(() => context?.describedBy.value);
const labelId = computed(() => context?.labelId.value);

const {handleFocusIn, handleFocusOut, isFocusVisible, isFocusWithin, isHovered} = useGroupState(
  groupRef,
  () => isDisabled.value,
);

const classes = computed(() =>
  cx(
    dateInputGroupVariants({fullWidth: props.fullWidth, variant: props.variant}).base(),
    className.value,
  ),
);

function handleMousedown(event: MouseEvent) {
  if (isDisabled.value) {
    return;
  }

  const target = event.target as Element | null;

  if (
    target?.closest(
      "[data-reka-date-field-segment], [data-reka-time-field-segment], [data-slot='date-picker-trigger'], [data-slot='date-range-picker-trigger']",
    )
  ) {
    return;
  }

  const segment = groupRef.value?.querySelector<HTMLElement>(
    "[data-reka-date-field-segment][tabindex='0'], [data-reka-time-field-segment][tabindex='0']",
  );

  if (!segment) {
    return;
  }

  event.preventDefault();
  segment.focus();
}
</script>

<template>
  <div
    ref="groupRef"
    v-bind="forwarded"
    role="group"
    :aria-describedby="describedBy"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-labelledby="labelId"
    :class="classes"
    :data-disabled="isDisabled ? 'true' : undefined"
    :data-focus-visible="isFocusVisible ? 'true' : undefined"
    :data-focus-within="isFocusWithin ? 'true' : undefined"
    :data-hovered="isHovered ? 'true' : undefined"
    :data-invalid="isInvalid ? 'true' : undefined"
    :data-readonly="isReadOnly ? 'true' : undefined"
    :data-slot="'date-input-group'"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @mousedown="handleMousedown"
  >
    <slot />
  </div>
</template>
