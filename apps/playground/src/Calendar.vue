<script setup lang="ts">
import {CalendarDate, isWeekend} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {
  CalendarCell,
  CalendarCellIndicator,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarNavButton,
  CalendarRoot,
} from "@sail-ui/vue/calendar";
import {
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
} from "@sail-ui/vue/calendar-year-picker";
import {
  RangeCalendarCell,
  RangeCalendarCellIndicator,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarRoot,
} from "@sail-ui/vue/range-calendar";
import {computed, shallowRef} from "vue";

const basicValue = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
const pickerValue = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
const multiValue = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
const rangeValue = shallowRef<{start: DateValue; end?: DateValue} | null>({
  start: new CalendarDate(2025, 2, 10),
  end: new CalendarDate(2025, 2, 12),
});

const basicFocused = shallowRef<DateValue | undefined>(new CalendarDate(2025, 2, 14));
const pickerFocused = shallowRef<DateValue | undefined>(new CalendarDate(2025, 2, 14));
const multiFocused = shallowRef<DateValue | undefined>(new CalendarDate(2025, 2, 14));
const rangeFocused = shallowRef<DateValue | undefined>(new CalendarDate(2025, 2, 10));

const isWeekendDate = (date: DateValue) => isWeekend(date, "en");

function formatDate(value: DateValue | null | undefined) {
  if (!value) {
    return "none";
  }

  return `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;
}

const basicLabel = computed(() => formatDate(basicValue.value));
const pickerLabel = computed(() => formatDate(pickerValue.value));
const multiLabel = computed(() => formatDate(multiValue.value));
const rangeLabel = computed(
  () => `${formatDate(rangeValue.value?.start)} → ${formatDate(rangeValue.value?.end)}`,
);
</script>

<template>
  <section id="calendar" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Calendar</h2>
    <div class="flex flex-wrap items-start gap-8">
      <div class="flex flex-col gap-2">
        <CalendarRoot
          v-model="basicValue"
          v-model:focused-value="basicFocused"
          aria-label="Event date"
          data-testid="calendar-basic"
        >
          <CalendarHeader>
            <CalendarNavButton page="previous" />
            <CalendarHeading />
            <CalendarNavButton page="next" />
          </CalendarHeader>
          <CalendarGrid>
            <CalendarGridHeader />
            <CalendarGridBody>
              <template #default="{date}">
                <CalendarCell :date="date">
                  <template #default="{formattedDate}">
                    {{ formattedDate }}
                    <CalendarCellIndicator />
                  </template>
                </CalendarCell>
              </template>
            </CalendarGridBody>
          </CalendarGrid>
        </CalendarRoot>
        <p class="text-sm text-muted">
          Selected: <span data-testid="calendar-basic-value">{{ basicLabel }}</span>
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <CalendarRoot
          v-model="pickerValue"
          v-model:focused-value="pickerFocused"
          aria-label="Picker date"
          data-testid="calendar-picker"
        >
          <CalendarHeader>
            <CalendarNavButton page="previous" />
            <CalendarYearPickerTrigger data-testid="calendar-picker-trigger">
              <CalendarYearPickerTriggerHeading />
              <CalendarYearPickerTriggerIndicator />
            </CalendarYearPickerTrigger>
            <CalendarNavButton page="next" />
          </CalendarHeader>
          <CalendarGrid>
            <CalendarGridHeader />
            <CalendarGridBody>
              <template #default="{date}">
                <CalendarCell :date="date">
                  <template #default="{formattedDate}">
                    {{ formattedDate }}
                    <CalendarCellIndicator />
                  </template>
                </CalendarCell>
              </template>
            </CalendarGridBody>
          </CalendarGrid>
          <CalendarYearPickerGrid data-testid="calendar-picker-grid">
            <CalendarYearPickerGridBody />
          </CalendarYearPickerGrid>
        </CalendarRoot>
        <p class="text-sm text-muted">
          Selected: <span data-testid="calendar-picker-value">{{ pickerLabel }}</span>
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <RangeCalendarRoot
          v-model="rangeValue"
          v-model:focused-value="rangeFocused"
          aria-label="Trip range"
          data-testid="range-calendar"
        >
          <RangeCalendarHeader>
            <RangeCalendarNavButton page="previous" />
            <RangeCalendarHeading />
            <RangeCalendarNavButton page="next" />
          </RangeCalendarHeader>
          <RangeCalendarGrid>
            <RangeCalendarGridHeader />
            <RangeCalendarGridBody>
              <template #default="{date}">
                <RangeCalendarCell :date="date">
                  <template #default="{formattedDate}">
                    {{ formattedDate }}
                    <RangeCalendarCellIndicator />
                  </template>
                </RangeCalendarCell>
              </template>
            </RangeCalendarGridBody>
          </RangeCalendarGrid>
        </RangeCalendarRoot>
        <p class="text-sm text-muted">
          Range: <span data-testid="range-calendar-value">{{ rangeLabel }}</span>
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Two visible months, weekends unavailable.</p>
      <CalendarRoot
        v-model="multiValue"
        v-model:focused-value="multiFocused"
        aria-label="Availability"
        class="w-full max-w-none overflow-x-auto"
        data-testid="calendar-two-month"
        :is-date-unavailable="isWeekendDate"
        :visible-duration="{months: 2}"
      >
        <div class="flex gap-8">
          <div class="w-64">
            <CalendarHeader>
              <CalendarNavButton page="previous" />
              <CalendarHeading class="flex-none" />
              <div class="size-6" />
            </CalendarHeader>
            <CalendarGrid>
              <CalendarGridHeader />
              <CalendarGridBody>
                <template #default="{date}">
                  <CalendarCell :date="date">
                    <template #default="{formattedDate}">
                      {{ formattedDate }}
                      <CalendarCellIndicator />
                    </template>
                  </CalendarCell>
                </template>
              </CalendarGridBody>
            </CalendarGrid>
          </div>
          <div class="w-64">
            <CalendarHeader>
              <div class="size-6" />
              <CalendarHeading class="flex-none" :offset="{months: 1}" />
              <CalendarNavButton page="next" />
            </CalendarHeader>
            <CalendarGrid :offset="{months: 1}">
              <CalendarGridHeader />
              <CalendarGridBody>
                <template #default="{date}">
                  <CalendarCell :date="date">
                    <template #default="{formattedDate}">
                      {{ formattedDate }}
                      <CalendarCellIndicator />
                    </template>
                  </CalendarCell>
                </template>
              </CalendarGridBody>
            </CalendarGrid>
          </div>
        </div>
      </CalendarRoot>
      <p class="text-sm text-muted">
        Selected: <span data-testid="calendar-two-month-value">{{ multiLabel }}</span>
      </p>
    </div>
  </section>
</template>
