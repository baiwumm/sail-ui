---
title: Separator
description: Divider with orientation and tone variants.
---

# Separator

```vue
<script setup lang="ts">
import {Separator} from "@sail-ui/vue/separator";
</script>

<template>
  <Separator class="my-4" />
</template>
```

## Demo

::demo-texture
::

## API

| Prop           | Type                                     | Default        |
| -------------- | ---------------------------------------- | -------------- |
| `orientation`  | `"horizontal" \| "vertical"`             | `"horizontal"` |
| `variant`      | `"default" \| "secondary" \| "tertiary"` | `"default"`    |
| `isDecorative` | `boolean`                                | `false`        |

A decorative separator renders `role="presentation"` with `aria-hidden`
instead of the `separator` role.
