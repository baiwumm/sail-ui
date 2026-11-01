---
title: Scroll Shadow
description: Edge shadows driven by real scroll position.
---

# Scroll Shadow

A JS-driven port of the upstream hook: `ResizeObserver` + scroll listeners
emit `data-top-scroll` / `data-bottom-scroll` / `data-left-scroll` /
`data-right-scroll` (`"true"`/`"false"` strings — the upstream contract), and
the CSS paints the shadows.

```vue
<script setup lang="ts">
import {ScrollShadow} from "@sail-ui/vue/scroll-shadow";
</script>

<template>
  <ScrollShadow class="h-64 w-80">
    <!-- scrollable content -->
  </ScrollShadow>
</template>
```

## API

| Prop            | Type                         | Notes                        |
| --------------- | ---------------------------- | ---------------------------- |
| `visibility`    | controlled flags             | overrides the computed state |
| `offset`        | `number`                     | edge threshold in px         |
| `size`          | `number`                     | shadow size                  |
| `orientation`   | `"horizontal" \| "vertical"` | restricts the axes           |
| `hideScrollBar` | `boolean`                    |                              |

All observers and listeners are cleaned up on unmount; RTL scrollLeft is
normalised with `Math.abs`. Without JS it degrades to no shadows rather than
blocking content.
