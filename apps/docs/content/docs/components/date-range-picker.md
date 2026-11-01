---
title: Date Range Picker
description: Range field with a RangeCalendar popover and two-sided validation.
---

# Date Range Picker

```vue
<script setup lang="ts">
import {
  DateRangePickerPopover,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from "@sail-ui/vue/date-range-picker";
</script>

<template>
  <DateRangePickerRoot v-model="range" locale="en">
    <DateRangePickerTrigger />
    <DateRangePickerPopover>
      <!-- RangeCalendar renders inside -->
    </DateRangePickerPopover>
  </DateRangePickerRoot>
</template>
```

## Demo

::demo-date-color
::

## API

`v-model` accepts `{start?, end?} | null` — half-typed ranges are preserved
while typing. Both ends are validated against `minValue`/`maxValue`/
`isDateUnavailable` and a reversed range is marked invalid (react-stately
semantics), driving `aria-invalid` / `data-invalid` on the field.
