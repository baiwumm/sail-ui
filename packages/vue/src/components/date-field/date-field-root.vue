<script setup lang="ts">
import {cx, dateFieldVariants} from "@sail-ui/styles";
import type {DateValue} from "@internationalized/date";
import {DateFieldRoot as DateFieldRootPrimitive} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDocumentDirection} from "../../shared/direction";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import DateInputGroupProvider from "../date-input-group/date-input-group-provider.vue";
import type {DateFieldRootEmits, DateFieldRootProps} from "./types";

defineOptions({name: "SailDateField", inheritAttrs: false});

const props = withDefaults(defineProps<DateFieldRootProps>(), {
  defaultValue: undefined,
  dir: undefined,
  fullWidth: false,
  granularity: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  isDateUnavailable: undefined,
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

const emit = defineEmits<DateFieldRootEmits>();

// Reka's `defaultValue` only initializes its internal state, so the initial
// value is fed back through the controlled prop; this keeps `change` in sync.
const initialValue = props.defaultValue ?? null;
const model = defineModel<DateValue | null>();
const currentValue = computed(() => (model.value === undefined ? initialValue : model.value));
const rekaValue = computed(() => currentValue.value ?? undefined);

const {className, forwarded} = useForwardedAttrs();

const classes = computed(() =>
  cx(dateFieldVariants({fullWidth: props.fullWidth}), className.value),
);

const documentDirection = useDocumentDirection();
const direction = computed(() => props.dir ?? documentDirection.value);

const labelId = useId();
const descriptionIds = ref<string[]>([]);
const describedBy = computed(() =>
  descriptionIds.value.length > 0 ? descriptionIds.value.join(" ") : undefined,
);
const errors = computed<string[]>(() => []);

const valueInvalid = computed(() => {
  const value = currentValue.value;

  if (!value) {
    return false;
  }

  if (props.isDateUnavailable?.(value)) {
    return true;
  }

  if (props.minValue && value.compare(props.minValue) < 0) {
    return true;
  }

  if (props.maxValue && value.compare(props.maxValue) > 0) {
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

function handleModelUpdate(value: DateValue | undefined) {
  const next: DateValue | null = value ?? null;

  model.value = next;
  emit("change", next);
}
</script>

<template>
  <DateFieldRootPrimitive
    v-bind="forwarded"
    :id="id"
    :aria-invalid="isInvalid ? 'true' : undefined"
    :class="classes"
    :data-required="isRequired ? 'true' : undefined"
    :data-slot="'date-field'"
    :default-placeholder="placeholderValue"
    :dir="direction"
    :disabled="isDisabled"
    :granularity="granularity"
    :hide-time-zone="hideTimeZone"
    :hour-cycle="hourCycle"
    :is-date-unavailable="isDateUnavailable"
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
        kind="date"
        :label-id="labelId"
        :segments="segments"
      >
        <slot />
      </DateInputGroupProvider>
    </template>
  </DateFieldRootPrimitive>
</template>
