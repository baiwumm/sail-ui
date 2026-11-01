---
title: Menu Item
description: Menu row with selection, command and danger variants.
---

# Menu Item

```vue
<script setup lang="ts">
import {MenuItem, MenuItemIndicator} from "@sail-ui/vue/menu";
</script>

<template>
  <MenuItem value="edit" text-value="Edit">
    <Label>Edit</Label>
    <MenuItemIndicator />
  </MenuItem>
</template>
```

## Demo

::demo-collections
::

## API

| Prop         | Type      | Notes                                  |
| ------------ | --------- | -------------------------------------- |
| `value`      | `string`  | emitted through the dropdown `@action` |
| `textValue`  | `string`  | typeahead text                         |
| `isDisabled` | `boolean` |                                        |

Submenu triggers render `data-slot="dropdown-submenu-trigger"` and the
indicator scales via `stroke-dashoffset` for single vs multiple selection
modes (upstream CSS contract).
