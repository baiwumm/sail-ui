<script setup lang="ts">
import {useCalendarYearPickerGridContext} from "../calendar/context";

import CalendarYearPickerCell from "./calendar-year-picker-cell.vue";

defineOptions({name: "SailCalendarYearPickerGridBody"});

const grid = useCalendarYearPickerGridContext();
</script>

<template>
  <template v-for="item in grid.items.value" :key="item.year">
    <slot
      :formatted-year="item.formatted"
      :is-current-year="item.year === grid.currentYear"
      :is-open="grid.isOpen.value"
      :is-selected="item.year === grid.focusedYear.value"
      :select-year="() => grid.selectYear(item.year)"
      :year="item.year"
    >
      <CalendarYearPickerCell :year="item.year" />
    </slot>
  </template>
</template>
