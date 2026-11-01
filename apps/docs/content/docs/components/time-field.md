---
title: Time Field
description: Segmented time input with 12/24-hour and second granularity.
---

# Time Field

```vue
<script setup lang="ts">
import {
  TimeFieldGroup,
  TimeFieldInput,
  TimeFieldRoot,
  TimeFieldSegment,
} from "@sail-ui/vue/time-field";
</script>

<template>
  <TimeFieldRoot v-model="time" class="w-40" hour-cycle="24">
    <Label>Time</Label>
    <TimeFieldGroup>
      <TimeFieldInput>
        <template #default="{segment}">
          <TimeFieldSegment :segment="segment" />
        </template>
      </TimeFieldInput>
    </TimeFieldGroup>
  </TimeFieldRoot>
</template>
```

## Demo

::demo-date-color
::

## API

Same shape as [Date Field](/docs/components/date-field) with `TimeValue`
(`Time` objects) and `granularity` down to seconds. Comparison anchors to the
local timezone (the timezone injection point is planned with the Nuxt module's
ConfigProvider).
