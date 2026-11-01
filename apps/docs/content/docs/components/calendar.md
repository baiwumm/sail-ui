---
title: Calendar
description: Month grid with keyboard navigation, ranges and unavailable dates.
---

# Calendar

```vue
<script setup lang="ts">
import {Calendar} from "@sail-ui/vue/calendar";
</script>

<template>
  <Calendar v-model="date" aria-label="Appointment" />
</template>
```

## Demo

::demo-calendar
::

## API

| Prop                    | Type                       | Notes                            |
| ----------------------- | -------------------------- | -------------------------------- |
| `v-model`               | `DateValue \| DateValue[]` | `@internationalized/date` values |
| `visibleDuration`       | `{months: number}`         | multi-month grids                |
| `pageBehavior`          | `"single" \| "visible"`    | paging granularity               |
| `isDateUnavailable`     | `(date) => boolean`        | renders unavailable cells        |
| `minValue` / `maxValue` | `DateValue`                | bounds                           |
| `initialFocus`          | `boolean`                  | focus the grid on mount          |

## Notes

- Values are `@internationalized/date` objects (`CalendarDate`, …), never
  native `Date`.
- `RangeCalendar` adds range selection with hover preview; `DatePicker` and
  `DateRangePicker` compose the calendar with a field and popover.
- Direction follows the explicit `dir` prop or `<html dir>`; week/day views of
  the upstream component are not implemented yet (see the migration notes).
