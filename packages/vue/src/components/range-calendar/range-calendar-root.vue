<script setup lang="ts">
import type {DateValue} from "@internationalized/date";
import {isEqualDay} from "@internationalized/date";
import {cx, rangeCalendarVariants} from "@sail-ui/styles";
import {
  RangeCalendarRoot as RangeCalendarRootPrimitive,
  injectDateRangePickerRootContext,
} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import CalendarProvider from "../calendar/calendar-provider.vue";
import {mapFirstDayOfWeek} from "../calendar/calendar-utils";
import type {
  RangeCalendarRootEmits,
  RangeCalendarRootProps,
  RangeCalendarValue,
} from "../calendar/types";
import RangeCalendarCell from "./range-calendar-cell.vue";

defineOptions({name: "SailRangeCalendar", inheritAttrs: false});

const props = withDefaults(defineProps<RangeCalendarRootProps>(), {
  allowNonContiguousRanges: false,
  defaultValue: undefined,
  defaultFocusedValue: undefined,
  defaultYearPickerOpen: false,
  firstDayOfWeek: undefined,
  initialFocus: false,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  isDisabled: false,
  isReadOnly: false,
  locale: "en",
  maxValue: undefined,
  minValue: undefined,
  pageBehavior: "visible",
  visibleDuration: undefined,
});

const emit = defineEmits<RangeCalendarRootEmits>();

// A range calendar rendered inside a date range picker popover inherits the
// picker state unless the consumer drives it explicitly.
const picker = injectDateRangePickerRootContext(null);

const initialModel = props.defaultValue ?? null;
const model = defineModel<RangeCalendarValue>();
const isBoundToPicker = computed(
  () => picker !== null && model.value === undefined && props.defaultValue === undefined,
);
const currentModel = computed(() => (model.value === undefined ? initialModel : model.value));
const focusedModel = defineModel<DateValue | undefined>("focusedValue");
// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultYearPickerOpen` can still initialize the picker.
const isYearPickerOpenModel = defineModel<boolean>("yearPickerOpen", {
  default: undefined as unknown as boolean,
});

const {attrs, className, forwarded} = useForwardedAttrs();

const slots = computed(() => rangeCalendarVariants());
const classes = computed(() => cx(slots.value.base(), className.value));

const calendarLabel = computed(() => attrs["aria-label"] as string | undefined);
// React Aria follows the document direction; Reka only knows an explicit `dir`
// or its ConfigProvider. Mirror the document on the client after hydration.
const documentDirection = ref<"ltr" | "rtl" | undefined>(undefined);
const direction = computed<"ltr" | "rtl" | undefined>(() => {
  const dir = attrs.dir;

  if (dir === "ltr" || dir === "rtl") {
    return dir;
  }

  if (isBoundToPicker.value) {
    return picker?.dir.value;
  }

  return documentDirection.value;
});
let directionObserver: MutationObserver | undefined;

onMounted(() => {
  const update = () => {
    documentDirection.value = document.documentElement.dir === "rtl" ? "rtl" : "ltr";
  };

  update();
  directionObserver = new MutationObserver(update);
  directionObserver.observe(document.documentElement, {
    attributeFilter: ["dir"],
    attributes: true,
  });
});

onBeforeUnmount(() => directionObserver?.disconnect());
const rootAttrs = computed(() => {
  const rest = {...forwarded.value};

  delete rest["aria-label"];
  delete rest.dir;

  return rest;
});

const locale = computed(() => (isBoundToPicker.value ? picker?.locale.value : props.locale));
const minValue = computed(() => (isBoundToPicker.value ? picker?.minValue.value : props.minValue));
const maxValue = computed(() => (isBoundToPicker.value ? picker?.maxValue.value : props.maxValue));
const isDisabledValue = computed(() =>
  isBoundToPicker.value ? picker?.disabled.value : props.isDisabled,
);
const isReadOnlyValue = computed(() =>
  isBoundToPicker.value ? picker?.readonly.value : props.isReadOnly,
);
const isDateDisabledMatcher = computed(() =>
  isBoundToPicker.value ? picker?.isDateDisabled : props.isDateDisabled,
);
const isDateUnavailableMatcher = computed(() =>
  isBoundToPicker.value ? picker?.isDateUnavailable : props.isDateUnavailable,
);
const isDateHighlightableMatcher = computed(() =>
  isBoundToPicker.value ? picker?.isDateHighlightable : undefined,
);
const allowNonContiguous = computed(() =>
  isBoundToPicker.value
    ? (picker?.allowNonContiguousRanges.value ?? false)
    : props.allowNonContiguousRanges,
);
const numberOfMonths = computed(() =>
  isBoundToPicker.value ? picker?.numberOfMonths.value : (props.visibleDuration?.months ?? 1),
);
const pagedNavigation = computed(() =>
  isBoundToPicker.value ? picker?.pagedNavigation.value : props.pageBehavior !== "single",
);
const weekStartsOn = computed(() =>
  isBoundToPicker.value && props.firstDayOfWeek === undefined
    ? picker?.weekStartsOn.value
    : mapFirstDayOfWeek(props.firstDayOfWeek),
);
const placeholderValue = computed(() =>
  isBoundToPicker.value ? (focusedModel.value ?? picker?.placeholder.value) : focusedModel.value,
);
const isYearPickerOpen = computed(
  () => isYearPickerOpenModel.value ?? props.defaultYearPickerOpen ?? false,
);

const rangeValue = computed(() => {
  if (isBoundToPicker.value) {
    return {
      start: picker?.modelValue.value.start,
      end: picker?.modelValue.value.end,
    };
  }

  return {
    start: currentModel.value?.start,
    end: currentModel.value?.end,
  };
});

function setYearPickerOpen(open: boolean) {
  isYearPickerOpenModel.value = open;
}

function handleModelUpdate(value: {start?: DateValue; end?: DateValue} | undefined) {
  if (isBoundToPicker.value) {
    const current = picker?.modelValue.value;

    if (
      value?.start &&
      value.end &&
      current?.start &&
      current.end &&
      isEqualDay(value.start, current.start) &&
      isEqualDay(value.end, current.end)
    ) {
      return;
    }

    picker?.onDateChange({start: value?.start, end: value?.end});
    return;
  }

  // Keep partial selections inside Reka so the range preview survives. Only a
  // complete range or a full clear is a public value change.
  if (value?.start && value.end) {
    const next = {start: value.start, end: value.end};

    model.value = next;
    emit("change", next);
    return;
  }

  if (!value?.start && !value?.end) {
    model.value = null;
    emit("change", null);
  }
}

function handleStartValueUpdate(date: DateValue | undefined) {
  if (isBoundToPicker.value) {
    picker?.onStartValueChange(date);
  }
}

function handlePlaceholderUpdate(date: DateValue) {
  if (isBoundToPicker.value) {
    if (!isEqualDay(date, picker?.placeholder.value ?? date)) {
      picker?.onPlaceholderChange(date);
    }

    emit("focus-change", date);
    return;
  }

  focusedModel.value = date;
  emit("focus-change", date);
}
</script>

<template>
  <RangeCalendarRootPrimitive
    v-bind="rootAttrs"
    :allow-non-contiguous-ranges="allowNonContiguous"
    :calendar-label="calendarLabel"
    :class="classes"
    :data-disabled="isDisabledValue ? 'true' : undefined"
    :data-invalid="undefined"
    :data-readonly="undefined"
    :data-slot="'range-calendar'"
    :default-placeholder="defaultFocusedValue"
    :dir="direction"
    :disable-days-outside-current-view="true"
    :disabled="isDisabledValue"
    :first-day-of-week="weekStartsOn"
    :fixed-date="isBoundToPicker ? picker?.fixedDate.value : undefined"
    :initial-focus="initialFocus"
    :is-date-disabled="isDateDisabledMatcher"
    :is-date-highlightable="isDateHighlightableMatcher"
    :is-date-unavailable="isDateUnavailableMatcher"
    :locale="locale"
    :max-value="maxValue"
    :maximum-days="isBoundToPicker ? picker?.maximumDays?.value : undefined"
    :min-value="minValue"
    :model-value="rangeValue"
    :number-of-months="numberOfMonths"
    :paged-navigation="pagedNavigation"
    :placeholder="placeholderValue"
    :readonly="isReadOnlyValue"
    :role="'application'"
    @update:model-value="handleModelUpdate"
    @update:placeholder="handlePlaceholderUpdate"
    @update:start-value="handleStartValueUpdate"
  >
    <CalendarProvider
      :cell-component="RangeCalendarCell"
      :is-multiple="false"
      :is-year-picker-open="isYearPickerOpen"
      kind="range-calendar"
      :label="calendarLabel"
      :set-year-picker-open="setYearPickerOpen"
      :slots="slots"
    >
      <slot />
    </CalendarProvider>
  </RangeCalendarRootPrimitive>
</template>
