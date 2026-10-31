<script setup lang="ts">
import {cx, timeFieldVariants} from "@sail-ui/styles";
import {toCalendarDateTime, today, getLocalTimeZone} from "@internationalized/date";
import {TimeFieldRoot as TimeFieldRootPrimitive, type TimeValue} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDocumentDirection} from "../../shared/direction";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import DateInputGroupProvider from "../date-input-group/date-input-group-provider.vue";
import type {TimeFieldRootEmits, TimeFieldRootProps} from "./types";

defineOptions({name: "SailTimeField", inheritAttrs: false});

const props = withDefaults(defineProps<TimeFieldRootProps>(), {
  defaultValue: undefined,
  dir: undefined,
  fullWidth: false,
  granularity: "minute",
  hideTimeZone: false,
  hourCycle: undefined,
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isRequired: false,
  locale: "en",
  maxValue: undefined,
  minValue: undefined,
  name: undefined,
  placeholderValue: undefined,
  step: undefined,
  stepSnapping: false,
});

const emit = defineEmits<TimeFieldRootEmits>();

const initialValue = props.defaultValue ?? null;
const model = defineModel<TimeValue | null>();
const currentValue = computed(() => (model.value === undefined ? initialValue : model.value));
const rekaValue = computed(() => currentValue.value ?? undefined);

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(timeFieldVariants({fullWidth: props.fullWidth}), className.value),
);

const documentDirection = useDocumentDirection();
const direction = computed(() => props.dir ?? documentDirection.value);

const labelId = useId();
const descriptionIds = ref<string[]>([]);
const describedBy = computed(() =>
  descriptionIds.value.length > 0 ? descriptionIds.value.join(" ") : undefined,
);
const errors = computed<string[]>(() => []);

// `Time` cannot be compared with calendar date values, so every time value is
// anchored to today before the min/max checks.
function toComparable(value: TimeValue) {
  return "day" in value
    ? toCalendarDateTime(value)
    : toCalendarDateTime(today(getLocalTimeZone()), value);
}

const valueInvalid = computed(() => {
  const value = currentValue.value;

  if (!value) {
    return false;
  }

  if (props.minValue && toComparable(value).compare(toComparable(props.minValue)) < 0) {
    return true;
  }

  if (props.maxValue && toComparable(value).compare(toComparable(props.maxValue)) > 0) {
    return true;
  }

  return false;
});

const isInvalid = computed(() => props.isInvalid || valueInvalid.value);

function registerDescription(id: string) {
  if (!descriptionIds.value.includes(id)) {
    descriptionIds.value = [...descriptionIds.value, id];
  }

  return () => {
    descriptionIds.value = descriptionIds.value.filter((item) => item !== id);
  };
}

provide(fieldContextKey, {
  describedBy,
  disabled: computed(() => props.isDisabled),
  errors,
  invalid: isInvalid,
  registerDescription,
  required: computed(() => props.isRequired),
});

provide(labelContextKey, {id: labelId, elementType: "span"});

function handleModelUpdate(value: TimeValue | undefined) {
  const next: TimeValue | null = value ?? null;

  model.value = next;
  emit("change", next);
}
</script>

<template>
  <TimeFieldRootPrimitive
    v-bind="forwarded"
    :id="id"
    :aria-invalid="isInvalid ? 'true' : undefined"
    :class="classes"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'time-field'"
    :default-placeholder="placeholderValue"
    :dir="direction"
    :disabled="isDisabled"
    :granularity="granularity"
    :hide-time-zone="hideTimeZone"
    :hour-cycle="hourCycle"
    :locale="locale"
    :max-value="maxValue"
    :min-value="minValue"
    :model-value="rekaValue"
    :name="name"
    :readonly="isReadOnly"
    :required="isRequired"
    :step="step"
    :step-snapping="stepSnapping"
    @update:model-value="handleModelUpdate"
  >
    <template #default="{segments}">
      <DateInputGroupProvider
        :is-read-only="isReadOnly"
        kind="time"
        :label-id="labelId"
        :segments="segments"
      >
        <slot />
      </DateInputGroupProvider>
    </template>
  </TimeFieldRootPrimitive>
</template>
