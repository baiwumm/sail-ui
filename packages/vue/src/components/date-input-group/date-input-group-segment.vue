<script setup lang="ts">
import {isKeyboardFocusVisible} from "@sail-ui/primitives";
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {DateFieldInput, DateRangeFieldInput, TimeFieldInput} from "reka-ui";
import {computed, inject, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {
  dateInputGroupContextKey,
  type DateInputGroupSegmentProps,
  type DateInputGroupSide,
} from "./types";

defineOptions({name: "SailDateInputGroupSegment", inheritAttrs: false});

const props = defineProps<DateInputGroupSegmentProps>();

const {className, forwarded} = useForwardedAttrs();
const context = inject(dateInputGroupContextKey, null);

const part = computed(() => props.segment.part);
const isLiteral = computed(() => part.value === "literal");
const isRange = computed(() => context?.kind === "date-range");
const activeSide = computed<DateInputGroupSide>(() => props.side ?? "start");
const component = computed(() => {
  if (context?.kind === "time") {
    return TimeFieldInput;
  }

  if (context?.kind === "date-range") {
    return DateRangeFieldInput;
  }

  return DateFieldInput;
});
const rangeProps = computed(() => (isRange.value ? {type: activeSide.value} : {}));
const segmentValues = computed<Record<string, unknown>>(() => {
  if (!context) {
    return {};
  }

  if (isRange.value) {
    return context.rangeSegmentValues?.value[activeSide.value] ?? {};
  }

  return context.segmentValues.value;
});

const isDisabled = computed(() => context?.isDisabled.value ?? false);
const isInvalid = computed(() => context?.isInvalid.value ?? false);
const isReadOnly = computed(() => context?.isReadOnly.value ?? false);

const isPlaceholder = computed(() => {
  if (isLiteral.value) {
    return false;
  }

  const values = segmentValues.value;

  return part.value === "dayPeriod" ? values.hour == null : values[part.value] == null;
});

// Reka's slot merge drops the `ref` of the as-child element, so the segment
// tracks its own interaction state from the events bound on the span.
const isHovered = ref(false);
const isFocused = ref(false);
const isFocusVisible = ref(false);

function handlePointerEnter(event: PointerEvent) {
  if (isDisabled.value || event.pointerType === "touch") {
    return;
  }

  isHovered.value = true;
}

function handlePointerLeave() {
  isHovered.value = false;
}

function handleFocus(event: FocusEvent) {
  if (isDisabled.value) {
    return;
  }

  isFocused.value = true;
  isFocusVisible.value = isKeyboardFocusVisible(event.currentTarget);
}

function handleBlur() {
  isFocused.value = false;
  isFocusVisible.value = false;
}

watch(isDisabled, (disabled) => {
  if (!disabled) {
    return;
  }

  isHovered.value = false;
  isFocused.value = false;
  isFocusVisible.value = false;
});

const classes = computed(() => cx(dateInputGroupVariants().segment(), className.value));
</script>

<template>
  <component :is="component" v-bind="rangeProps" as-child :part="part">
    <span
      v-bind="forwarded"
      :aria-disabled="!isLiteral && isDisabled ? true : undefined"
      :aria-invalid="!isLiteral && isInvalid ? true : undefined"
      :aria-readonly="!isLiteral && isReadOnly ? true : undefined"
      :class="classes"
      :data-disabled="!isLiteral && isDisabled ? 'true' : undefined"
      :data-focus-visible="!isLiteral && isFocusVisible ? 'true' : undefined"
      :data-focused="!isLiteral && isFocused ? 'true' : undefined"
      :data-hovered="!isLiteral && isHovered ? 'true' : undefined"
      :data-invalid="!isLiteral && isInvalid ? 'true' : undefined"
      :data-placeholder="!isLiteral && isPlaceholder ? 'true' : undefined"
      :data-readonly="!isLiteral && isReadOnly ? 'true' : undefined"
      :data-slot="'date-input-group-segment'"
      :data-type="part"
      @blur="handleBlur"
      @focus="handleFocus"
      @pointercancel="handlePointerLeave"
      @pointerenter="handlePointerEnter"
      @pointerleave="handlePointerLeave"
    >
      {{ segment.value }}
    </span>
  </component>
</template>
