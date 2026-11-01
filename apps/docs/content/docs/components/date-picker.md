---
title: Date Picker
description: Date field with a calendar popover.
---

# Date Picker

Composes `DateField` + `Calendar` in a popover. The calendar follows the
document direction and re-clicking the selected date keeps it (no accidental
deselect).

```vue
<script setup lang="ts">
import {DatePickerPopover, DatePickerRoot, DatePickerTrigger} from "@sail-ui/vue/date-picker";
</script>

<template>
  <DatePickerRoot v-model="date" locale="en">
    <DatePickerTrigger />
    <DatePickerPopover>
      <!-- calendar renders inside -->
    </DatePickerPopover>
  </DatePickerRoot>
</template>
```

## Demo

::demo-date-color
::

## API

Accepts all [Date Field](/docs/components/date-field) props plus
`v-model:open` / `defaultOpen` for the popover and the calendar surface
options (`visibleDuration`, `pageBehavior`). Exposes `open()` / `close()` /
`isOpen`.
