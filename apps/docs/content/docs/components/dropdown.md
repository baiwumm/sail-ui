---
title: Dropdown
description: Trigger + floating menu with full keyboard support.
---

# Dropdown

```vue
<script setup lang="ts">
import {Dropdown, DropdownMenu, DropdownPopover, DropdownTrigger} from "@sail-ui/vue/dropdown";
import {MenuItem, MenuItemIndicator} from "@sail-ui/vue/menu";
</script>

<template>
  <Dropdown @action="onAction">
    <DropdownTrigger>Project actions</DropdownTrigger>
    <DropdownPopover>
      <DropdownMenu>
        <MenuItem value="edit" text-value="Edit">
          <Label>Edit</Label>
          <MenuItemIndicator />
        </MenuItem>
      </DropdownMenu>
    </DropdownPopover>
  </Dropdown>
</template>
```

## Demo

::demo-collections
::

## API

| Prop           | Type             | Notes |
| -------------- | ---------------- | ----- |
| `v-model:open` | `boolean`        |       |
| `dir`          | `"ltr" \| "rtl"` |       |

Events: `@action` carries the activated item value.

Keyboard: arrows move, Home/End jump, typeahead searches, Enter activates,
Escape closes; the popover flips above the viewport edge when space runs out.
Selection model and close-on-select semantics are specified in ADR 0013.
