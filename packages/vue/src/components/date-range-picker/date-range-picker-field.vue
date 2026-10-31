<script setup lang="ts">
import type {DateValue} from "@internationalized/date";
import {isEqualDay} from "@internationalized/date";
import {
  DateRangeFieldRoot as DateRangeFieldRootPrimitive,
  injectDateRangePickerRootContext,
} from "reka-ui";
import {onBeforeUnmount} from "vue";

import DateRangePickerFieldShell from "./date-range-picker-field-shell.vue";

defineOptions({name: "SailDateRangePickerField", inheritAttrs: false});

defineProps<{
  labelId: string;
  startName?: string;
  endName?: string;
}>();

const picker = injectDateRangePickerRootContext();

function setFieldRef(value: unknown) {
  picker.dateFieldRef.value = value as typeof picker.dateFieldRef.value;
}

onBeforeUnmount(() => {
  picker.dateFieldRef.value = undefined;
});

function handleRangeUpdate(value: {start?: DateValue; end?: DateValue}) {
  const current = picker.modelValue.value;

  if (
    value.start &&
    current.start &&
    value.end &&
    current.end &&
    value.start.compare(current.start) === 0 &&
    value.end.compare(current.end) === 0
  ) {
    return;
  }

  // Reka's range field emits partial ranges while the user types; the picker
  // root accepts them at runtime even though its context is typed as a full
  // `DateRange`.
  picker.onDateChange(value as {start: DateValue; end: DateValue});
}

function handlePlaceholderUpdate(value: DateValue) {
  if (
    isEqualDay(value, picker.placeholder.value) &&
    value.compare(picker.placeholder.value) === 0
  ) {
    return;
  }

  picker.onPlaceholderChange(value);
}
</script>

<template>
  <DateRangeFieldRootPrimitive
    :id="picker.id.value"
    :ref="setFieldRef"
    v-slot="{segments}"
    as-child
    :dir="picker.dir.value"
    :disabled="picker.disabled.value"
    :granularity="picker.granularity.value"
    :hide-time-zone="picker.hideTimeZone.value"
    :hour-cycle="picker.hourCycle.value"
    :is-date-unavailable="picker.isDateUnavailable"
    :locale="picker.locale.value"
    :max-value="picker.maxValue.value"
    :min-value="picker.minValue.value"
    :model-value="picker.modelValue.value"
    :name="picker.name.value"
    :placeholder="picker.placeholder.value"
    :readonly="picker.readonly.value"
    :required="picker.required.value"
    :step="picker.step.value"
    style="display: contents"
    @update:model-value="handleRangeUpdate"
    @update:placeholder="handlePlaceholderUpdate"
  >
    <DateRangePickerFieldShell
      v-bind="$attrs"
      :end-name="endName"
      :is-read-only="picker.readonly.value"
      :label-id="labelId"
      :range-segments="segments"
      :start-name="startName"
    >
      <slot />
    </DateRangePickerFieldShell>
  </DateRangeFieldRootPrimitive>
</template>
