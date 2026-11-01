---
title: Toggle Button
description: Pressable button with a selected state, standalone or in a group.
---

# Toggle Button

```vue
<script setup lang="ts">
import {ToggleButton} from "@sail-ui/vue/toggle-button";
</script>

<template>
  <ToggleButton v-model="muted">Mute</ToggleButton>
</template>
```

## Demo

::demo-toggle
::

## API

| Prop                              | Type      | Notes                            |
| --------------------------------- | --------- | -------------------------------- |
| `v-model`                         | `boolean` | standalone mode                  |
| `value`                           | `string`  | key inside a `ToggleButtonGroup` |
| `variant` / `size` / `isIconOnly` |           | inherited from the group         |
| `isDisabled`                      | `boolean` |                                  |

Inside a single-mode group, clicking the selected item deselects it (upstream
RAC semantics); arrow keys move within the group.
