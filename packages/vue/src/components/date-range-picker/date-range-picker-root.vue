<script setup lang="ts">
import type {DateValue} from "@internationalized/date";
import {useOverlayState} from "@sail-ui/primitives";
import {dateRangePickerVariants} from "@sail-ui/styles";
import {DateRangePickerRoot as DateRangePickerRootPrimitive} from "reka-ui";
import {computed, provide, ref, useId} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {fieldContextKey} from "../../shared/field-context";
import {labelContextKey} from "../../shared/label-context";
import {mapFirstDayOfWeek} from "../calendar/calendar-utils";
import {dateRangePickerContextKey, type DateRangePickerContext} from "./context";
import DateRangePickerField from "./date-range-picker-field.vue";
import type {
  DateRangePickerRootEmits,
  DateRangePickerRootProps,
  DateRangePickerValue,
} from "./types";

defineOptions({name: "SailDateRangePicker", inheritAttrs: false});

const props = withDefaults(defineProps<DateRangePickerRootProps>(), {
  allowNonContiguousRanges: false,
  closeOnSelect: true,
  defaultOpen: false,
  defaultValue: undefined,
  dir: undefined,
  endName: undefined,
  firstDayOfWeek: undefined,
  fixedDate: undefined,
  granularity: undefined,
  hideTimeZone: false,
  hourCycle: undefined,
  id: undefined,
  isDateDisabled: undefined,
  isDateHighlightable: undefined,
  isDateUnavailable: undefined,
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isRequired: false,
  locale: "en",
  maxValue: undefined,
  maximumDays: undefined,
  minValue: undefined,
  name: undefined,
  pageBehavior: "visible",
  placeholderValue: undefined,
  startName: undefined,
  step: undefined,
  visibleDuration: undefined,
});

const emit = defineEmits<DateRangePickerRootEmits>();

// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultOpen` can still initialize the overlay.
const openModel = defineModel<boolean>("open", {default: undefined as unknown as boolean});
const initialValue = props.defaultValue ?? null;
const model = defineModel<DateRangePickerValue | null>();
const currentValue = computed(() => (model.value === undefined ? initialValue : model.value));
const rekaValue = computed(() => ({
  start: currentValue.value?.start,
  end: currentValue.value?.end,
}));

const overlay = useOverlayState({
  isOpen: () => openModel.value,
  defaultOpen: props.defaultOpen,
  onOpenChange: (isOpen) => {
    openModel.value = isOpen;
  },
});

const {className, forwarded} = useForwardedAttrs();
const slots = computed(() => dateRangePickerVariants());

const triggerRef = ref<HTMLButtonElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const labelId = useId();

provide<DateRangePickerContext>(dateRangePickerContextKey, {
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

  const date = currentValue.value?.end ?? currentValue.value?.start;

  if (!date) {
    return false;
  }

  if (props.isDateUnavailable?.(date)) {
    return true;
  }

  if (props.minValue && date.compare(props.minValue) < 0) {
    return true;
  }

  if (props.maxValue && date.compare(props.maxValue) > 0) {
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

function handleModelUpdate(value: {start?: DateValue; end?: DateValue}) {
  const next: DateRangePickerValue | null =
    value.start || value.end ? {start: value.start, end: value.end} : null;

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
  <DateRangePickerRootPrimitive
    :id="id"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :close-on-select="closeOnSelect"
    :dir="dir"
    :disabled="isDisabled"
    :fixed-date="fixedDate"
    :granularity="granularity"
    :hide-time-zone="hideTimeZone"
    :hour-cycle="hourCycle"
    :is-date-disabled="isDateDisabled"
    :is-date-highlightable="isDateHighlightable"
    :is-date-unavailable="isDateUnavailable"
    :locale="locale"
    :max-value="maxValue"
    :maximum-days="maximumDays"
    :min-value="minValue"
    :model-value="rekaValue"
    :name="name"
    :number-of-months="numberOfMonths"
    :open="overlay.isMounted.value"
    :paged-navigation="pagedNavigation"
    :placeholder="placeholderValue"
    :readonly="isReadOnly"
    :required="isRequired"
    :step="step"
    :week-starts-on="weekStartsOn"
    @update:model-value="handleModelUpdate"
    @update:open="handleOpenChange"
  >
    <DateRangePickerField
      v-bind="forwarded"
      :class="className"
      :end-name="endName"
      :label-id="labelId"
      :start-name="startName"
    >
      <slot />
    </DateRangePickerField>
  </DateRangePickerRootPrimitive>
</template>
