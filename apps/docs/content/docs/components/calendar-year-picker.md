---
title: Calendar Year Picker
description: Year grid inside the calendar, marked preview.
---

# Calendar Year Picker

**Preview** — the upstream `calendar-year-picker` is still in development, so
this component is best-effort aligned and may shift with upstream.

The year grid opens from the calendar heading trigger: a 3-column grid with
arrow keys, Home/End and Escape to close. Twenty cells render on the server,
locked by the contract tests.

```vue
<script setup lang="ts">
import {Calendar} from "@sail-ui/vue/calendar";
</script>

<template>
  <!-- Click the calendar heading to open the year grid -->
  <Calendar v-model="date" aria-label="Date" />
</template>
```

## Demo

::demo-date-color
::
