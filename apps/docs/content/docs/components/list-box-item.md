---
title: List Box Item
description: Selectable row part with label/description wiring and indicator.
---

# List Box Item

The row part of a [List Box](/docs/components/list-box). `Label` and
`Description` inside the item are associated automatically through the item
context; `ListBoxItemIndicator` renders the selection check.

```vue
<script setup lang="ts">
import {ListBox, ListBoxItem, ListBoxItemIndicator} from "@sail-ui/vue/list-box";
</script>

<template>
  <ListBox v-model="value" aria-label="Team">
    <ListBoxItem value="bob" text-value="Bob">
      <Label>Bob</Label>
      <Description>Design</Description>
      <ListBoxItemIndicator />
    </ListBoxItem>
  </ListBox>
</template>
```

## Demo

::demo-collections
::

## API

| Prop         | Type      | Notes                                     |
| ------------ | --------- | ----------------------------------------- |
| `value`      | `key`     | selection key                             |
| `textValue`  | `string`  | typeahead text when no `Label` is present |
| `isDisabled` | `boolean` |                                           |

`ListBoxItemRoot` is the unwrapped root for custom row markup.
