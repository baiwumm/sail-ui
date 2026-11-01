---
title: Toggle Button Group
description: Single or multiple selection toggle collection.
---

# Toggle Button Group

```vue
<script setup lang="ts">
import {ToggleButton} from "@sail-ui/vue/toggle-button";
import {ToggleButtonGroup, ToggleButtonGroupSeparator} from "@sail-ui/vue/toggle-button-group";
</script>

<template>
  <ToggleButtonGroup v-model="formats" type="multiple">
    <ToggleButton value="bold">Bold</ToggleButton>
    <ToggleButtonGroupSeparator />
    <ToggleButton value="italic">Italic</ToggleButton>
  </ToggleButtonGroup>
</template>
```

## Demo

::demo-toggle
::

## API

| Prop          | Type                         | Default        | Notes                     |
| ------------- | ---------------------------- | -------------- | ------------------------- |
| `type`        | `"single" \| "multiple"`     | `"single"`     |                           |
| `v-model`     | `string` / `string[]`        |                | depends on the mode       |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |                           |
| `size`        | `"sm" \| "md" \| "lg"`       | propagated     |                           |
| `isDetached`  | `boolean`                    | `false`        | unattached visual variant |

React → Vue: replaces `selectionMode` + `selectedKeys` (`Set`) with `type` +
`v-model`. Single mode arrow keys select while moving (radio convention —
documented migration difference).
