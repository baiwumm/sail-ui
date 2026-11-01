<script setup lang="ts">
import {cx, calendarVariants} from "@sail-ui/styles";
import {isEqualDay} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {CalendarRoot as CalendarRootPrimitive, injectDatePickerRootContext} from "reka-ui";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import CalendarCell from "./calendar-cell.vue";
import CalendarProvider from "./calendar-provider.vue";
import {mapFirstDayOfWeek} from "./calendar-utils";
import type {CalendarRootEmits, CalendarRootProps, CalendarValue} from "./types";

defineOptions({name: "SailCalendar", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarRootProps>(), {
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
  selectionMode: "single",
  visibleDuration: undefined,
});

const emit = defineEmits<CalendarRootEmits>();

// A calendar rendered inside a date picker popover inherits the picker state
// unless the consumer drives it explicitly. Reka's own picker calendar does
// the same; without this the popover calendar would be disconnected.
const picker = injectDatePickerRootContext(null);

// Reka's `defaultValue` only accepts a single date, so the initial value is
// fed back through the controlled prop to support arrays for multiple mode.
const initialModel = props.defaultValue ?? null;
const model = defineModel<CalendarValue>();
const isBoundToPicker = computed(
  () => picker !== null && model.value === undefined && props.defaultValue === undefined,
);
const rekaValue = computed(() => {
  if (isBoundToPicker.value) {
    return picker?.modelValue.value;
  }

  return model.value === undefined ? initialModel : model.value;
});
const focusedModel = defineModel<DateValue | undefined>("focusedValue");
// An explicit undefined default keeps Vue from casting an absent Boolean prop
// to false, so `defaultYearPickerOpen` can still initialize the picker.
const isYearPickerOpenModel = defineModel<boolean>("yearPickerOpen", {
  default: undefined as unknown as boolean,
});

const {attrs, className, forwarded} = useForwardedAttrs();

const slots = computed(() => calendarVariants());
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
const numberOfMonths = computed(() =>
  isBoundToPicker.value ? picker?.numberOfMonths.value : (props.visibleDuration?.months ?? 1),
);
const pagedNavigation = computed(() =>
  isBoundToPicker.value ? picker?.pagedNavigation.value : props.pageBehavior !== "single",
);
const isMultiple = computed(() =>
  isBoundToPicker.value ? false : props.selectionMode === "multiple",
);
const preventDeselect = computed(() =>
  isBoundToPicker.value ? picker?.preventDeselect.value : !isMultiple.value,
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

function setYearPickerOpen(open: boolean) {
  isYearPickerOpenModel.value = open;
}

function handleModelUpdate(value: DateValue | DateValue[] | undefined) {
  if (isBoundToPicker.value) {
    const date = Array.isArray(value) ? value[0] : value;

    if (date && picker?.modelValue.value && isEqualDay(date, picker.modelValue.value)) {
      return;
    }

    picker?.onDateChange(date);
    return;
  }

  const next: CalendarValue = value ?? null;

  model.value = next;
  emit("change", next);
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
  <CalendarRootPrimitive
    v-bind="rootAttrs"
    :calendar-label="calendarLabel"
    :class="classes"
    :data-disabled="isDisabledValue ? 'true' : undefined"
    :data-slot="'calendar'"
    :default-placeholder="defaultFocusedValue"
    :dir="direction"
    :disable-days-outside-current-view="true"
    :disabled="isDisabledValue"
    :first-day-of-week="weekStartsOn"
    :initial-focus="initialFocus"
    :is-date-disabled="isDateDisabledMatcher"
    :is-date-unavailable="isDateUnavailableMatcher"
    :locale="locale"
    :max-value="maxValue"
    :min-value="minValue"
    :model-value="rekaValue"
    :multiple="isMultiple"
    :number-of-months="numberOfMonths"
    :paged-navigation="pagedNavigation"
    :placeholder="placeholderValue"
    :prevent-deselect="preventDeselect"
    :readonly="isReadOnlyValue"
    :role="'application'"
    @update:model-value="handleModelUpdate"
    @update:placeholder="handlePlaceholderUpdate"
  >
    <CalendarProvider
      :cell-component="CalendarCell"
      :is-multiple="isMultiple"
      :is-year-picker-open="isYearPickerOpen"
      kind="calendar"
      :label="calendarLabel"
      :set-year-picker-open="setYearPickerOpen"
      :slots="slots"
    >
      <slot />
    </CalendarProvider>
  </CalendarRootPrimitive>
</template>
