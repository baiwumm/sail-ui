---
title: Chip
description: Compact status or category label with variants, colors and sizes.
---

# Chip

```vue
<script setup lang="ts">
import {Chip} from "@sail-ui/vue/chip";
</script>

<template>
  <Chip color="accent" variant="soft">vue</Chip>
</template>
```

## Demo

::demo-chip
::

## API

| Prop      | Type                                                          | Default       |
| --------- | ------------------------------------------------------------- | ------------- |
| `variant` | `"primary" \| "secondary" \| "soft" \| "tertiary"`            | `"secondary"` |
| `color`   | `"default" \| "accent" \| "success" \| "danger" \| "warning"` | `"default"`   |
| `size`    | `"sm" \| "md" \| "lg"`                                        | `"md"`        |

Removable selections are `Tag` / `TagGroup` territory — see those pages.
