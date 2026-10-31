<script setup lang="ts">
import {
  injectDateFieldRootContext,
  injectDateRangeFieldRootContext,
  injectTimeFieldRootContext,
} from "reka-ui";
import {computed, inject, provide} from "vue";

import {fieldContextKey} from "../../shared/field-context";
import {
  dateInputGroupContextKey,
  type DateInputGroupKind,
  type DateInputGroupRangeSegments,
  type DateInputGroupSide,
  type DateSegmentContent,
} from "./types";

defineOptions({name: "SailDateInputGroupProvider"});

const props = defineProps<{
  kind: DateInputGroupKind;
  segments: DateSegmentContent[];
  rangeSegments?: DateInputGroupRangeSegments;
  labelId: string;
  isReadOnly: boolean;
}>();

const field = inject(fieldContextKey, null);
const dateField = injectDateFieldRootContext(null);
const timeField = injectTimeFieldRootContext(null);
const rangeField = injectDateRangeFieldRootContext(null);

const rekaField = computed(() => dateField ?? timeField);
const segments = computed(() => props.segments);
const rangeSegments = computed(() => props.rangeSegments);
const segmentValues = computed<Record<string, unknown>>(() => {
  if (props.kind === "date-range") {
    return {};
  }

  return (rekaField.value?.segmentValues.value ?? {}) as Record<string, unknown>;
});
const rangeSegmentValues = computed<Record<DateInputGroupSide, Record<string, unknown>>>(() => ({
  start: (rangeField?.segmentValues.start.value ?? {}) as Record<string, unknown>,
  end: (rangeField?.segmentValues.end.value ?? {}) as Record<string, unknown>,
}));
const rekaInvalid = computed(
  () => rangeField?.isInvalid.value ?? rekaField.value?.isInvalid.value ?? false,
);
const fallback = computed(() => false);
const fallbackDescription = computed<string | undefined>(() => undefined);

provide(dateInputGroupContextKey, {
  kind: props.kind,
  segments,
  segmentValues,
  rangeSegments,
  rangeSegmentValues,
  isInvalid: field?.invalid ?? rekaInvalid,
  isDisabled: field?.disabled ?? rangeField?.disabled ?? rekaField.value?.disabled ?? fallback,
  isReadOnly: computed(() => props.isReadOnly),
  describedBy: field?.describedBy ?? fallbackDescription,
  labelId: computed(() => props.labelId),
});
</script>

<template>
  <slot />
</template>
