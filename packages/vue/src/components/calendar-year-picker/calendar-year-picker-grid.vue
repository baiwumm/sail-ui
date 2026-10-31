<script setup lang="ts">
import {cx, calendarYearPickerVariants} from "@sail-ui/styles";
import type {DateValue} from "@internationalized/date";
import {computed, nextTick, onMounted, provide, ref, watch} from "vue";

import {useForwardedAttrs} from "../../shared/attrs";
import {getYearGridLabel, getYearItems} from "../calendar/calendar-utils";
import {calendarYearPickerGridContextKey, useCalendarContext} from "../calendar/context";
import type {CalendarYearPickerGridProps} from "../calendar/types";

defineOptions({name: "SailCalendarYearPickerGrid", inheritAttrs: false});

const props = withDefaults(defineProps<CalendarYearPickerGridProps>(), {
  format: undefined,
  visibleYears: undefined,
});

const root = useCalendarContext();
const state = root.state;
const {className, forwarded} = useForwardedAttrs();

const gridRef = ref<HTMLDivElement | null>(null);
const top = ref(0);
const height = ref(0);

const slots = computed(() => calendarYearPickerVariants());
const classes = computed(() => cx(slots.value.yearGrid(), className.value));
const isOpen = computed(() => root.isYearPickerOpen.value);
const items = computed(() => getYearItems(state, props.visibleYears, props.format));
const focusedYear = computed(() => {
  const placeholder = state.placeholder.value;
  const match = items.value.find((item) => item.year === placeholder.year);

  return match?.year ?? placeholder.year;
});
const activeYear = ref(focusedYear.value);
const currentYear = new Date().getFullYear();
const gridLabel = computed(() => getYearGridLabel(state.locale.value));
const style = computed(() => ({height: `${height.value}px`, top: `${top.value}px`}));

function setActiveYear(year: number) {
  activeYear.value = year;
}

function selectYear(year: number) {
  const item = items.value.find((entry) => entry.year === year);

  if (!item) {
    return;
  }

  root.setYearPickerOpen(false);
  state.onPlaceholderChange(item.date);
}

function focusYearCell(year: number) {
  gridRef.value?.querySelector<HTMLElement>(`[data-year='${year}']`)?.focus();
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    root.setYearPickerOpen(false);

    return;
  }

  const years = items.value;

  if (!isOpen.value || years.length === 0) {
    return;
  }

  const currentIndex = years.findIndex((item) => item.year === activeYear.value);

  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;

  switch (event.key) {
    case "ArrowRight":
      nextIndex = Math.min(currentIndex + 1, years.length - 1);
      break;
    case "ArrowLeft":
      nextIndex = Math.max(currentIndex - 1, 0);
      break;
    case "ArrowDown":
      nextIndex = Math.min(currentIndex + 3, years.length - 1);
      break;
    case "ArrowUp":
      nextIndex = Math.max(currentIndex - 3, 0);
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = years.length - 1;
      break;
    default:
      return;
  }

  const nextYear = years[nextIndex]?.year;

  if (nextIndex === currentIndex || nextYear == null) {
    return;
  }

  event.preventDefault();
  activeYear.value = nextYear;
  focusYearCell(nextYear);
}

function measure() {
  const parent = state.parentElement.value;
  const dayGrid = parent?.querySelector(`[data-slot='${root.kind}-grid']`) as HTMLElement | null;

  if (!dayGrid) {
    return;
  }

  top.value = dayGrid.offsetTop;
  height.value = dayGrid.offsetHeight;
}

async function focusActiveYear() {
  const years = items.value;

  if (years.length === 0) {
    return;
  }

  const target = years.some((item) => item.year === focusedYear.value)
    ? focusedYear.value
    : years[0]!.year;

  activeYear.value = target;
  await nextTick();
  focusYearCell(target);
}

watch(items, (value) => {
  if (isOpen.value && value.length > 0 && !value.some((item) => item.year === activeYear.value)) {
    activeYear.value = value[0]!.year;
  }
});

watch(isOpen, (open) => {
  if (open) {
    measure();
    void focusActiveYear();
  }
});

watch(
  () => state.placeholder.value as DateValue,
  () => measure(),
  {flush: "post"},
);

onMounted(() => {
  measure();

  if (isOpen.value) {
    void focusActiveYear();
  }
});

provide(calendarYearPickerGridContextKey, {
  activeYear,
  currentYear,
  focusedYear,
  isOpen,
  items,
  selectYear,
  setActiveYear,
});
</script>

<template>
  <div
    v-bind="forwarded"
    ref="gridRef"
    :aria-hidden="isOpen ? 'false' : 'true'"
    :aria-label="gridLabel"
    :class="classes"
    :data-open="isOpen ? 'true' : undefined"
    :data-slot="'calendar-year-picker-grid'"
    role="listbox"
    :style="style"
    tabindex="-1"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>
