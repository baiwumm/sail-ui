<script setup lang="ts">
import type {Component} from "vue";

import {computed, provide} from "vue";

import {calendarContextKey, injectRekaCalendarState} from "./context";
import type {CalendarKind, CalendarSlotsValue, RekaRangeCalendarState} from "./types";

defineOptions({name: "SailCalendarProvider", inheritAttrs: false});

const props = defineProps<{
  cellComponent: Component;
  isMultiple: boolean;
  isYearPickerOpen: boolean;
  kind: CalendarKind;
  label?: string;
  setYearPickerOpen: (open: boolean) => void;
  slots: CalendarSlotsValue;
}>();

const state = injectRekaCalendarState(props.kind);

if (!state) {
  throw new Error("Calendar parts must be used inside <Calendar> or <RangeCalendar>.");
}

const rangeState = props.kind === "range-calendar" ? (state as RekaRangeCalendarState) : null;

provide(calendarContextKey, {
  cellComponent: props.cellComponent,
  heading: computed(() => state.headingValue.value),
  isMultiple: computed(() => props.isMultiple),
  isYearPickerOpen: computed(() => props.isYearPickerOpen),
  kind: props.kind,
  label: computed(() => props.label ?? "Event Date"),
  rangeState,
  setYearPickerOpen: (open: boolean) => props.setYearPickerOpen(open),
  slots: props.slots,
  state,
});
</script>

<template>
  <slot />
</template>
