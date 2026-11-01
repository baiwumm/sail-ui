---
title: Range Calendar
description: Two-sided date range grid with hover preview.
---

# Range Calendar

```vue
<script setup lang="ts">
import {RangeCalendar} from "@sail-ui/vue/range-calendar";
</script>

<template>
  <RangeCalendar v-model="range" aria-label="Stay dates" />
</template>
```

## Demo

::demo-date-color
::

## API

`v-model` is `{start: DateValue, end: DateValue}`. Hover previews the pending
range; cells inside an invalid highlighted range render
`data-invalid`/`aria-invalid`. Keyboard, unavailable dates and
`initialFocus` match the [Calendar](/docs/components/calendar) contract.
