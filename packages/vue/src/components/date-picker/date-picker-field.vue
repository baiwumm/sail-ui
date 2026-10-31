<script setup lang="ts">
import type {DateValue} from "@internationalized/date";
import {DateFieldRoot as DateFieldRootPrimitive, injectDatePickerRootContext} from "reka-ui";
import {onBeforeUnmount} from "vue";

import DatePickerFieldShell from "./date-picker-field-shell.vue";

defineOptions({name: "SailDatePickerField", inheritAttrs: false});

defineProps<{labelId: string}>();

const picker = injectDatePickerRootContext();

function setFieldRef(value: unknown) {
  picker.dateFieldRef.value = value as typeof picker.dateFieldRef.value;
}

onBeforeUnmount(() => {
  picker.dateFieldRef.value = undefined;
});

function handleDateUpdate(value: DateValue | undefined) {
  const current = picker.modelValue.value;

  if (value && current && value.compare(current) === 0) {
    return;
  }

  picker.onDateChange(value);
}

function handlePlaceholderUpdate(value: DateValue) {
  if (value.compare(picker.placeholder.value) === 0) {
    return;
  }

  picker.onPlaceholderChange(value);
}
</script>

<template>
  <DateFieldRootPrimitive
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
    @update:model-value="handleDateUpdate"
    @update:placeholder="handlePlaceholderUpdate"
  >
    <DatePickerFieldShell
      v-bind="$attrs"
      :is-read-only="picker.readonly.value"
      :label-id="labelId"
      :segments="segments"
    >
      <slot />
    </DatePickerFieldShell>
  </DateFieldRootPrimitive>
</template>
