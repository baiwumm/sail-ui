---
title: Menu
description: Menu surface composed from the dropdown menu primitives.
---

# Menu

An independent `Menu` is composed from the dropdown parts — place it inside a
`DropdownPopover` (ADR 0013). `MenuItem` / `MenuSection` render inside it.

```vue
<script setup lang="ts">
import {Dropdown, DropdownMenu, DropdownPopover, DropdownTrigger} from "@sail-ui/vue/dropdown";
import {MenuItem} from "@sail-ui/vue/menu";
</script>

<template>
  <Dropdown>
    <DropdownTrigger>Actions</DropdownTrigger>
    <DropdownPopover>
      <DropdownMenu>
        <MenuItem value="edit" text-value="Edit">Edit</MenuItem>
      </DropdownMenu>
    </DropdownPopover>
  </Dropdown>
</template>
```

## Demo

::demo-collections
::

## API

MenuItem roles derive from behaviour: `menuitem`, `menuitemradio` and
`menuitemcheckbox` (`aria-checked` included), with danger variants and
section-level selection overrides. `MenuSection` wraps grouped items.
