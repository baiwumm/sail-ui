---
title: Surface
description: Elevation wrapper that assigns the surface context to children.
---

# Surface

`Surface` sets the surface context consumed by nested parts (like Card
sections) and applies the elevation variant.

```vue
<script setup lang="ts">
import {Surface} from "@sail-ui/vue/surface";
</script>

<template>
  <Surface variant="secondary">
    <p>Content on a secondary surface.</p>
  </Surface>
</template>
```

## Demo

::demo-texture
::

## API

| Prop      | Type                                                      |
| --------- | --------------------------------------------------------- |
| `variant` | `"default" \| "secondary" \| "tertiary" \| "transparent"` |
