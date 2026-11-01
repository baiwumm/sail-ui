---
title: Color Swatch
description: Solid color block showing the current color value.
---

# Color Swatch

```vue
<script setup lang="ts">
import {ColorSwatchRoot} from "@sail-ui/vue/color-swatch";
</script>

<template>
  <ColorSwatchRoot v-model="color" size="lg" />
</template>
```

## Demo

::demo-date-color
::

## API

| Prop      | Type              | Notes                     |
| --------- | ----------------- | ------------------------- |
| `v-model` | `string \| Color` | empty renders transparent |
| `size`    | sizes             |                           |
| `shape`   | shape variants    |                           |

The swatch carries `--color-swatch-current`, so custom CSS can reference the
resolved color.
