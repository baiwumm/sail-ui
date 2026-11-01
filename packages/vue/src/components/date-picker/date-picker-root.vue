<script setup lang="ts">
import type {DateValue} from "@internationalized/date";
import {useOverlayState} from "@sail-ui/primitives";
import {datePickerVariants} from "@sail-ui/styles";
import {DatePickerRoot as DatePickerRootPrimitive} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {useDocumentDirection} from "../../shared/direction";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import {mapFirstDayOfWeek} from "../calendar/calendar-utils";
import {datePickerContextKey, type DatePickerContext} from "./context";
import DatePickerField from "./date-picker-field.vue";
import type {DatePickerRootEmits, DatePickerRootProps} from "./types";

defineOptions({name: "SailDatePicker", inheritAttrs: false});

const props = withDefaults(defineProps<DatePickerRootProps>(), {
  closeOnSelect: true,
  defaultOpen: false,
  defaultValue: undefined,
  dir: undefined,
  firstDayOfWeek: undefined,
  granularity: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  id: undefined,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isRequired: false,
  locale: "en",
  maxValue: undefined,
  minValue: undefined,
  name: undefined,
  pageBehavior: "visible",
  placeholderValue: undefined,
  step: undefined,
  stepSnapping: false,
  visibleDuration: undefined,
});

const emit = defineEmits<DatePickerRootEmits>();

// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultOpen` can still initialize the overlay.
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});
const initialValue = props.defaultValue ?? null;
const model = defineModel<DateValue | null>();
const currentValue = computed(() => (model.value === undefined ? initialValue : model.value));
const rekaValue = computed<DateValue | undefined>(() => currentValue.value ?? undefined);

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => datePickerVariants());

// React Aria follows the document direction; Reka only knows an explicit
// `dir`, so fall back to `<html dir>` like the other field components.
const documentDirection = useDocumentDirection();
const direction = computed(() => props.dir ?? documentDirection.value);

const triggerRef = ref<HTMLButtonElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const labelId = useId();

provide<DatePickerContext>(datePickerContextKey, {
  slots,
  triggerRef,
  anchorRef,
  overlay,
  labelId,
});

const descriptionIds = ref<string[]>([]);
const describedBy = computed(() =>
  descriptionIds.value.length > 0 ? descriptionIds.value.join(" ") : undefined,
);
const errors = computed<string[]>(() => []);

const valueInvalid = computed(() => {
  if (props.isInvalid) {
    return true;
  }

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

const disabled = computed(() => props.isDisabled);
const required = computed(() => props.isRequired);

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
  disabled,
  errors,
  invalid: valueInvalid,
  registerDescription,
  required,
});

provide(labelContextKey, {id: labelId, elementType: "span"});

const numberOfMonths = computed(() => props.visibleDuration?.months ?? 1);
const pagedNavigation = computed(() => props.pageBehavior !== "single");
const weekStartsOn = computed(() => mapFirstDayOfWeek(props.firstDayOfWeek));

function handleOpenChange(isOpen: boolean) {
  if (isOpen) {
    overlay.open();
    return;
  }

  overlay.close();
}

function handleModelUpdate(value: DateValue | undefined) {
  const next: DateValue | null = value ?? null;

  model.value = next;
  emit("change", next);
}

defineExpose({
  open: overlay.open,
  close: overlay.close,
  isOpen: overlay.isOpen,
});
</script>

<template>
  <DatePickerRootPrimitive
    :id="id"
    :close-on-select="closeOnSelect"
    :dir="direction"
    :disabled="isDisabled"
    :granularity="granularity"
    :hide-time-zone="hideTimeZone"
    :hour-cycle="hourCycle"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :locale="locale"
    :max-value="maxValue"
    :min-value="minValue"
    :model-value="rekaValue"
    :name="name"
    :number-of-months="numberOfMonths"
    :open="overlay.isMounted.value"
    :paged-navigation="pagedNavigation"
    :placeholder="placeholderValue"
    :prevent-deselect="true"
    :readonly="isReadOnly"
    :required="isRequired"
    :step="step"
    :step-snapping="stepSnapping"
    :week-starts-on="weekStartsOn"
    @update:model-value="handleModelUpdate"
    @update:open="handleOpenChange"
  >
    <DatePickerField v-bind="forwarded" :class="className" :label-id="labelId">
      <slot />
    </DatePickerField>
  </DatePickerRootPrimitive>
</template>
