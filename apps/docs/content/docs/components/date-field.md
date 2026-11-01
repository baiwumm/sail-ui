---
title: Date Field
description: Segmented date input with locale formatting and validation.
---

# Date Field

```vue
<script setup lang="ts">
import {
  DateFieldGroup,
  DateFieldInput,
  DateFieldRoot,
  DateFieldSegment,
} from "@sail-ui/vue/date-field";
</script>

<template>
  <DateFieldRoot v-model="date" class="w-64" locale="en">
    <Label>Date</Label>
    <DateFieldGroup>
      <DateFieldInput>
        <template #default="{segment}">
          <DateFieldSegment :segment="segment" />
        </template>
      </DateFieldInput>
    </DateFieldGroup>
  </DateFieldRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop                    | Type                         | Notes                            |
| ----------------------- | ---------------------------- | -------------------------------- |
| `v-model`               | `DateValue \| null`          | `@internationalized/date` values |
| `granularity`           | `day \| hour \| minute \| …` |                                  |
| `hourCycle`             | `12 \| 24`                   |                                  |
| `minValue` / `maxValue` | `DateValue`                  | marks the field invalid          |
| `placeholderValue`      | `DateValue`                  |                                  |
| `locale`                | `string`                     | segment order and formatting     |
| `hideTimeZone`          | `boolean`                    |                                  |

Values are `CalendarDate`/`CalendarDateTime` objects, never native `Date`
(see the migration guide). Arrow keys move and step segments.
