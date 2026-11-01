---
title: Tooltip
description: Delayed hover/focus hint with a shared grace period.
---

# Tooltip

```vue
<script setup lang="ts">
import {Tooltip, TooltipArrow, TooltipContent, TooltipTrigger} from "@sail-ui/vue/tooltip";
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <Button is-icon-only aria-label="Settings">⚙</Button>
    </TooltipTrigger>
    <TooltipContent show-arrow>
      <TooltipArrow />
      Tooltip content
    </TooltipContent>
  </Tooltip>
</template>
```

## Demo

::demo-overlay
::

## API

| Prop           | Type             | Notes                          |
| -------------- | ---------------- | ------------------------------ |
| `delay`        | `number`         | open delay (`--tooltip-delay`) |
| `closeDelay`   | `number`         | grace period before closing    |
| `trigger`      | focus/hover mode |                                |
| `v-model:open` | `boolean`        | controlled state               |
| `isDisabled`   | `boolean`        |                                |

Touch devices ignore hover and rely on focus. Scroll dismisses the tooltip.
The React warmup behaviour (consecutive tooltips skipping the delay) is a
documented migration difference.
