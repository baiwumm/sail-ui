---
title: Skeleton
description: Loading placeholder with shimmer or pulse animation.
---

# Skeleton

```vue
<script setup lang="ts">
import {Skeleton} from "@sail-ui/vue/skeleton";
</script>

<template>
  <Skeleton class="h-6 w-40" />
</template>
```

## Demo

::demo-texture
::

## API

| Prop            | Type                             | Default     |
| --------------- | -------------------------------- | ----------- |
| `animationType` | `"shimmer" \| "pulse" \| "none"` | `"shimmer"` |

Size it with utility classes; the CSS variables are read at mount so reduced
motion preferences are honoured like upstream.
