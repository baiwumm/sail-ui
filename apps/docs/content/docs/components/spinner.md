---
title: Spinner
description: Loading indicator with theme colors and four sizes.
---

# Spinner

```vue
<script setup lang="ts">
import {Spinner} from "@sail-ui/vue/spinner";
</script>

<template>
  <Spinner size="md" />
</template>
```

## Demo

::demo-texture
::

## API

| Prop    | Type                                                          | Default     |
| ------- | ------------------------------------------------------------- | ----------- |
| `size`  | `"sm" \| "md" \| "lg" \| "xl"`                                | `"md"`      |
| `color` | `"current" \| "accent" \| "success" \| "danger" \| "warning"` | `"current"` |

`color="current"` inherits the text color, which is how Button renders its
pending spinner.
