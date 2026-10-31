<script setup lang="ts">
import {cx, dateInputGroupVariants} from "@sail-ui/styles";
import {computed, inject, ref, useAttrs} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import DateInputGroupSegment from "./date-input-group-segment.vue";
import {
  dateInputGroupContextKey,
  type DateInputGroupInputProps,
  type DateInputGroupSide,
  type DateSegmentContent,
} from "./types";
import {useGroupState} from "./use-group-state";

defineOptions({name: "SailDateInputGroupInput", inheritAttrs: false});

defineProps<DateInputGroupInputProps>();

const attrs = useAttrs();
const {className, forwarded} = useForwardedAttrs();
const context = inject(dateInputGroupContextKey, null);

const inputRef = ref<HTMLElement | null>(null);

// A range renders one input per side, selected with the literal `slot`
// attribute because the upstream CSS styles `[slot="start"]` and `[slot="end"]`.
const side = computed<DateInputGroupSide | undefined>(() => {
  const slot = attrs.slot;

  return slot === "start" || slot === "end" ? slot : undefined;
});
const activeSide = computed<DateInputGroupSide>(() => side.value ?? "start");
const isRange = computed(() => context?.kind === "date-range");

const isDisabled = computed(() => context?.isDisabled.value ?? false);
const isInvalid = computed(() => context?.isInvalid.value ?? false);
const isReadOnly = computed(() => context?.isReadOnly.value ?? false);
const describedBy = computed(() => context?.describedBy.value);
const labelId = computed(() => context?.labelId.value);
const segments = computed<DateSegmentContent[]>(() => {
  if (!context) {
    return [];
  }

  if (isRange.value) {
    return context.rangeSegments?.value?.[activeSide.value] ?? [];
  }

  return context.segments.value;
});

const {handleFocusIn, handleFocusOut, isFocusVisible, isFocusWithin, isHovered} = useGroupState(
  inputRef,
  () => isDisabled.value,
);

const classes = computed(() => cx(dateInputGroupVariants().input(), className.value));
</script>

<template>
  <div
    ref="inputRef"
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
    :data-slot="'date-input-group-input'"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <template v-for="(segment, index) in segments" :key="`${segment.part}-${index}`">
      <slot :segment="segment" :side="isRange ? activeSide : undefined">
        <DateInputGroupSegment :segment="segment" :side="isRange ? activeSide : undefined" />
      </slot>
    </template>
  </div>
</template>
