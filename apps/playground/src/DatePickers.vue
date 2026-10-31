<script setup lang="ts">
import {CalendarDate} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
} from "@sail-ui/vue/calendar";
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldSegment,
  DateFieldSuffix,
} from "@sail-ui/vue/date-field";
import {
  DatePickerPopover,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerTriggerIndicator,
} from "@sail-ui/vue/date-picker";
import {
  DateRangePickerPopover,
  DateRangePickerRangeSeparator,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerTriggerIndicator,
  type DateRangePickerValue,
} from "@sail-ui/vue/date-range-picker";
import {Label} from "@sail-ui/vue/label";
import {RangeCalendarRoot} from "@sail-ui/vue/range-calendar";
import {computed, shallowRef} from "vue";

const dateValue = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
const rangeValue = shallowRef<DateRangePickerValue | null>({
  start: new CalendarDate(2025, 2, 10),
  end: new CalendarDate(2025, 2, 12),
});
const travelValue = shallowRef<DateRangePickerValue | null>(null);
const minDate = new CalendarDate(2025, 2, 1);
const maxDate = new CalendarDate(2025, 4, 30);

const formatDate = (value: DateValue | undefined) =>
  value
    ? `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
    : "none";

const dateLabel = computed(() => formatDate(dateValue.value ?? undefined));
const rangeLabel = computed(() => {
  const value = rangeValue.value;

  return value?.start && value.end
    ? `${formatDate(value.start)} → ${formatDate(value.end)}`
    : "none";
});
const travelLabel = computed(() => {
  const value = travelValue.value;

  return value?.start && value.end
    ? `${formatDate(value.start)} → ${formatDate(value.end)}`
    : "none";
});
</script>

<template>
  <section id="date-pickers" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Date pickers</h2>
    <div class="flex flex-wrap items-start gap-6">
      <DatePickerRoot
        v-model="dateValue"
        class="w-64"
        data-testid="date-picker-basic"
        locale="en"
        name="date"
        :max-value="maxDate"
        :min-value="minDate"
        :placeholder-value="minDate"
      >
        <Label>Event date</Label>
        <DateFieldGroup>
          <DateFieldInput>
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateFieldSuffix>
            <DatePickerTrigger aria-label="Choose event date">
              <DatePickerTriggerIndicator />
            </DatePickerTrigger>
          </DateFieldSuffix>
        </DateFieldGroup>
        <DatePickerPopover>
          <CalendarRoot>
            <CalendarHeader>
              <CalendarNavButton :page="'previous'" />
              <CalendarHeading />
              <CalendarNavButton :page="'next'" />
            </CalendarHeader>
            <CalendarGrid>
              <CalendarGridHeader />
              <CalendarGridBody />
            </CalendarGrid>
          </CalendarRoot>
        </DatePickerPopover>
      </DatePickerRoot>

      <DateRangePickerRoot
        v-model="rangeValue"
        class="w-80"
        data-testid="date-range-picker-basic"
        end-name="end"
        locale="en"
        start-name="start"
        :max-value="maxDate"
        :min-value="minDate"
        :placeholder-value="minDate"
      >
        <Label>Stay</Label>
        <DateFieldGroup>
          <DateFieldInput v-bind="{slot: 'start'}">
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateRangePickerRangeSeparator />
          <DateFieldInput v-bind="{slot: 'end'}">
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateFieldSuffix>
            <DateRangePickerTrigger aria-label="Choose stay dates">
              <DateRangePickerTriggerIndicator />
            </DateRangePickerTrigger>
          </DateFieldSuffix>
        </DateFieldGroup>
        <DateRangePickerPopover>
          <RangeCalendarRoot>
            <CalendarHeader>
              <CalendarNavButton :page="'previous'" />
              <CalendarHeading />
              <CalendarNavButton :page="'next'" />
            </CalendarHeader>
            <CalendarGrid>
              <CalendarGridHeader />
              <CalendarGridBody />
            </CalendarGrid>
          </RangeCalendarRoot>
        </DateRangePickerPopover>
      </DateRangePickerRoot>

      <DateRangePickerRoot
        v-model="travelValue"
        class="w-80"
        data-testid="date-range-picker-disabled"
        is-disabled
        locale="en"
      >
        <Label>Travel dates</Label>
        <DateFieldGroup>
          <DateFieldInput v-bind="{slot: 'start'}">
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateRangePickerRangeSeparator />
          <DateFieldInput v-bind="{slot: 'end'}">
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
          <DateFieldSuffix>
            <DateRangePickerTrigger aria-label="Choose travel dates">
              <DateRangePickerTriggerIndicator />
            </DateRangePickerTrigger>
          </DateFieldSuffix>
        </DateFieldGroup>
        <DateRangePickerPopover>
          <RangeCalendarRoot>
            <CalendarGrid>
              <CalendarGridBody />
            </CalendarGrid>
          </RangeCalendarRoot>
        </DateRangePickerPopover>
      </DateRangePickerRoot>
    </div>

    <p class="text-sm text-muted">
      Event date: <span data-testid="date-picker-value">{{ dateLabel }}</span>
    </p>
    <p class="text-sm text-muted">
      Stay: <span data-testid="date-range-picker-value">{{ rangeLabel }}</span>
    </p>
    <p class="text-sm text-muted">
      Travel: <span data-testid="date-range-picker-disabled-value">{{ travelLabel }}</span>
    </p>
  </section>
</template>
