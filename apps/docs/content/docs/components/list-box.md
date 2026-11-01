---
title: List Box
description: Selectable list with sections, disabled keys and arrow-key navigation.
---

# List Box

```vue
<script setup lang="ts">
import {ListBox, ListBoxItem, ListBoxItemIndicator} from "@sail-ui/vue/list-box";
</script>

<template>
  <ListBox v-model="value" aria-label="Team members" class="w-56">
    <ListBoxItem value="bob" text-value="Bob">
      <Label>Bob</Label>
      <ListBoxItemIndicator />
    </ListBoxItem>
  </ListBox>
</template>
```

## Demo

::demo-collections
::

## API

| Prop            | Type                               | Notes                          |
| --------------- | ---------------------------------- | ------------------------------ |
| `v-model`       | `key \| key[]`                     | depends on `selectionMode`     |
| `selectionMode` | `"none" \| "single" \| "multiple"` | default `"single"`             |
| `by`            | `string \| ((a, b) => boolean)`    | value comparison               |
| `disabledKeys`  | `Iterable<key>`                    |                                |
| `defaultValue`  | `key \| key[]`                     | uncontrolled initial selection |

Sections compose via `ListBoxSection` + a `Header`; `text-value` feeds
typeahead. The roving tab index anchors on the selected item, so Tab enters
the list at the current selection.
