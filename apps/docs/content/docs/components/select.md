---
title: Select
description: Trigger, popover and listbox composed on the Reka Select primitive.
---

# Select

```vue
<script setup lang="ts">
import {
  Select,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@sail-ui/vue/select";
</script>

<template>
  <Select v-model="value" placeholder="Pick one">
    <SelectTrigger aria-label="Fruit">
      <SelectValue />
      <SelectIndicator />
    </SelectTrigger>
    <SelectPopover>
      <SelectListBox>
        <SelectItem text-value="Apple" value="apple">Apple</SelectItem>
      </SelectListBox>
    </SelectPopover>
  </Select>
</template>
```

## Demo

::demo-select
::

## API

| Prop          | Type                            | Notes                             |
| ------------- | ------------------------------- | --------------------------------- |
| `v-model`     | `key` / `key[]`                 | single or multiple via `multiple` |
| `by`          | `string \| ((a, b) => boolean)` | custom value comparison           |
| `placeholder` | `string`                        | shown when nothing is selected    |

## React → Vue differences

- `selectedKey` / `onSelectionChange` become `v-model` + `@selection-change`.
- SSR emits the placeholder label; the selected text hydrates on the client
  (documented ADR 0012 — no hydration mismatch, but first-paint text differs).
- The listbox is composed from `SelectListBox` / `SelectItem` parts, not a
  bare `ListBox`.
