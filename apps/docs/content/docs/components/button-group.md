---
title: Button Group
description: Segmented button cluster with propagated size, variant and disabled state.
---

# Button Group

```vue
<script setup lang="ts">
import {Button, ButtonGroup, ButtonGroupSeparator} from "@sail-ui/vue/button-group";
</script>

<template>
  <ButtonGroup>
    <Button variant="secondary">Day</Button>
    <Button variant="secondary">Week</Button>
    <Button variant="secondary">Month</Button>
  </ButtonGroup>
</template>
```

## Demo

::demo-button-group
::

## API

| Prop               | Type                         | Default        | Notes                              |
| ------------------ | ---------------------------- | -------------- | ---------------------------------- |
| `orientation`      | `"horizontal" \| "vertical"` | `"horizontal"` |                                    |
| `size` / `variant` | Button values                | —              | propagated to direct child buttons |
| `isDisabled`       | `boolean`                    | `false`        | cascades to children               |
| `fullWidth`        | `boolean`                    | `false`        |                                    |

`ButtonGroupSeparator` renders the divider between attached buttons.
