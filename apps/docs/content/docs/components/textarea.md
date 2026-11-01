---
title: Textarea
description: Multi-line field with optional auto-growing height.
---

# Textarea

```vue
<script setup lang="ts">
import {Textarea} from "@sail-ui/vue/textarea";
</script>

<template>
  <Textarea v-model="bio" :rows="4" auto-resize />
</template>
```

## Demo

::demo-input
::

## API

| Prop                       | Type      | Notes                                    |
| -------------------------- | --------- | ---------------------------------------- |
| `v-model`                  | `string`  |                                          |
| `rows`                     | `number`  | initial height                           |
| `autoResize`               | `boolean` | grows with content, sized on mount too   |
| `variant`                  | variants  | inherited from the enclosing `TextField` |
| `isDisabled` / `isInvalid` | `boolean` |                                          |

Inside a `TextField` it renders a real `<textarea>` and inherits the field
variant; standalone usage works too.
