<script setup lang="ts">
import {CalendarDate, Time} from "@internationalized/date";
import type {DateValue} from "@internationalized/date";
import {Description} from "@sail-ui/vue/description";
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldPrefix,
  DateFieldRoot,
  DateFieldSegment,
  DateFieldSuffix,
} from "@sail-ui/vue/date-field";
import {FieldError} from "@sail-ui/vue/field-error";
import {Label} from "@sail-ui/vue/label";
import {
  TimeFieldGroup,
  TimeFieldInput,
  TimeFieldRoot,
  type TimeValue,
} from "@sail-ui/vue/time-field";
import {computed, shallowRef} from "vue";

const dateValue = shallowRef<DateValue | null>(new CalendarDate(2025, 2, 14));
const timeValue = shallowRef<TimeValue | null>(new Time(13, 45));
const rangeMin = new CalendarDate(2025, 2, 1);
const defaultTime = new Time(13, 45, 30);

const dateLabel = computed(() => {
  const value = dateValue.value;

  return value
    ? `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`
    : "none";
});

const timeLabel = computed(() => {
  const value = timeValue.value;

  return value
    ? `${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`
    : "none";
});
</script>

<template>
  <section id="date-fields" class="flex flex-col gap-4">
    <h2 class="text-lg font-semibold">Date &amp; time fields</h2>
    <div class="flex flex-wrap items-start gap-6">
      <DateFieldRoot
        v-model="dateValue"
        class="w-64"
        data-testid="date-field-basic"
        locale="en"
        name="date"
      >
        <Label>Date</Label>
        <DateFieldGroup>
          <DateFieldInput>
            <template #default="{segment}">
              <DateFieldSegment :segment="segment" />
            </template>
          </DateFieldInput>
        </DateFieldGroup>
        <Description>Arrow keys change the focused segment.</Description>
      </DateFieldRoot>

      <DateFieldRoot
        class="w-64"
        data-testid="date-field-invalid"
        is-invalid
        is-required
        name="start-date"
      >
        <Label>Start date</Label>
        <DateFieldGroup>
          <DateFieldInput />
        </DateFieldGroup>
        <FieldError>Choose a start date.</FieldError>
      </DateFieldRoot>

      <DateFieldRoot
        class="w-72"
        data-testid="date-field-range"
        :default-value="new CalendarDate(2025, 1, 1)"
        :min-value="rangeMin"
        name="due-date"
      >
        <Label>Due date</Label>
        <DateFieldGroup variant="secondary">
          <DateFieldPrefix>On</DateFieldPrefix>
          <DateFieldInput />
          <DateFieldSuffix>UTC</DateFieldSuffix>
        </DateFieldGroup>
        <Description>Dates before February 2025 are invalid.</Description>
      </DateFieldRoot>

      <DateFieldRoot
        class="w-64"
        data-testid="date-field-disabled"
        is-disabled
        name="disabled-date"
      >
        <Label>Locked date</Label>
        <DateFieldGroup>
          <DateFieldInput />
        </DateFieldGroup>
      </DateFieldRoot>
    </div>

    <p class="text-sm text-muted">
      Controlled date: <span data-testid="date-field-value">{{ dateLabel }}</span>
    </p>

    <div class="flex flex-wrap items-start gap-6">
      <TimeFieldRoot
        v-model="timeValue"
        class="w-56"
        data-testid="time-field-basic"
        locale="en"
        name="time"
      >
        <Label>Time</Label>
        <TimeFieldGroup>
          <TimeFieldInput />
        </TimeFieldGroup>
      </TimeFieldRoot>

      <TimeFieldRoot
        class="w-56"
        data-testid="time-field-24h"
        :default-value="defaultTime"
        granularity="second"
        :hour-cycle="24"
        locale="en"
        name="time-24"
      >
        <Label>Alarm</Label>
        <TimeFieldGroup>
          <TimeFieldInput />
        </TimeFieldGroup>
        <Description>24-hour clock with seconds.</Description>
      </TimeFieldRoot>
    </div>

    <p class="text-sm text-muted">
      Controlled time: <span data-testid="time-field-value">{{ timeLabel }}</span>
    </p>
  </section>
</template>
