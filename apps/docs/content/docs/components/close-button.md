---
title: Close Button
description: Dismiss affordance with pending state and built-in accessibility.
---

# Close Button

```vue
<script setup lang="ts">
import {CloseButton} from "@sail-ui/vue/close-button";
</script>

<template>
  <CloseButton aria-label="Dismiss" @press="dismiss" />
</template>
```

## Demo

::demo-close-button
::

## API

| Prop         | Type      | Default     | Notes                                   |
| ------------ | --------- | ----------- | --------------------------------------- |
| `variant`    | variants  | `"default"` |                                         |
| `isDisabled` | `boolean` | `false`     | emits `aria-disabled` + `data-disabled` |
| `isPending`  | `boolean` | `false`     | shows a spinner, forces `type="button"` |

The accessible label defaults to `Close` when no `aria-label` is given.
