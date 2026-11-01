---
title: Color Area
description: 2D saturation/brightness picker with keyboard support.
---

# Color Area

```vue
<script setup lang="ts">
import {ColorAreaRoot, ColorAreaThumb} from "@sail-ui/vue/color-area";
</script>

<template>
  <ColorAreaRoot
    v-model="color"
    color-space="hsl"
    x-channel="hue"
    y-channel="saturation"
    aria-label="Pick a color"
    class="h-40 w-64"
  >
    <ColorAreaThumb />
  </ColorAreaRoot>
</template>
```

## Demo

::demo-date-color
::

## API

| Prop                      | Type                  | Notes                |
| ------------------------- | --------------------- | -------------------- |
| `v-model`                 | `string \| Color`     |                      |
| `colorSpace`              | `"hsl" \| "rgb" \| …` |                      |
| `x-channel` / `y-channel` | channels              | axes per color space |

Window-level pointer listeners are paired on unmount; the thumb carries
`--color-area-thumb-color`. The root `role="group"` wrapper difference vs RAC
is an accepted parity gap (T07).
